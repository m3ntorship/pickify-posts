import { EntityRepository, Repository } from 'typeorm';
import { PostCreationDto } from '../dto/postCreation.dto';
import { Post } from './post.entity';
import { User } from '../../users/entities/user.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  /**
   * createPost
   */
  public async createPost(
    postCreationDto: PostCreationDto,
    user: User,
  ): Promise<Post> {
    const { caption, type, is_hidden, media_count } = postCreationDto;
    const post = this.create();
    post.caption = caption;
    post.type = type;
    post.is_hidden = is_hidden;
    post.unhandled_media = media_count;
    post.user = user;
    post.created = false;
    post.ready = false;
    return await this.save(post);
  }
  public async getAllPosts(): Promise<Post[]> {
    return await this.createQueryBuilder('post')
      .select([
        'post.uuid',
        'post.created',
        'post.caption',
        'post.is_hidden',
        'post.created_at',
        'post.type',
        'post_media.url',
        'user.uuid',
        'user.name',
        'user.profile_pic',
        'group.uuid',
        'group.name',
        'group_media.url',
        'option.uuid',
        'option.vote_count',
        'option.body',
        'option_media.url',
      ])
      .where('post.created = :created', { created: true })
      .leftJoin('post.groups', 'group')
      .leftJoin('group.options', 'option')
      .leftJoin('post.user', 'user')
      .leftJoin('post.media', 'post_media')
      .leftJoin('option.media', 'option_media')
      .leftJoin('group.media', 'group_media')
      .orderBy({
        'post.created_at': 'DESC',
        'group.order': 'ASC',
        'option.order': 'ASC',
      })
      .getMany();
  }
  /**
   * flagPostCreation
   */
  public async flagPostCreation(flag: boolean, post: Post): Promise<void> {
    post.created = flag;

    // make post ready if it has no media or all media got handled
    if (post.unhandled_media === 0) {
      post.ready = true;
    }
    await this.save(post);
  }

  public async getDetailedPostById(postid: string): Promise<Post> {
    const post = await this.createQueryBuilder('post')
      .select([
        'post.uuid',
        'post.created',
        'post.caption',
        'post.is_hidden',
        'post.created_at',
        'post.type',
        'post_media.url',
        'user.uuid',
        'user.name',
        'user.profile_pic',
        'group.uuid',
        'group.name',
        'group_media.url',
        'option.uuid',
        'option.vote_count',
        'option.body',
        'option_media.url',
      ])
      .leftJoin('post.groups', 'group')
      .leftJoin('group.options', 'option')
      .leftJoin('post.user', 'user')
      .leftJoin('post.media', 'post_media')
      .leftJoin('option.media', 'option_media')
      .leftJoin('group.media', 'group_media')
      .where('post.uuid = :uuid', { uuid: postid })
      .getOne();

    return post;
  }

  public async getPostById(postId: string): Promise<Post> {
    return await this.createQueryBuilder('post')
      .where('post.uuid = :postId', {
        postId,
      })
      .leftJoinAndSelect('post.user', 'user')
      .getOne();
  }

  // handles post ready column
  public async handleReadiness(post: Post): Promise<void> {
    // decrease unhandled media by 1
    post.unhandled_media = post.unhandled_media - 1;

    // if all media files are handled, make post ready
    if (post.unhandled_media === 0) {
      post.ready = true;
    }

    await this.save(post);
  }
}
