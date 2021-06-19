import { EntityRepository, Repository } from 'typeorm';
import { PostCreationDto } from '../dto/postCreation.dto';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  /**
   * createPost
   */
  public async createPost(
    postCreationDto: PostCreationDto,
    userId: number,
  ): Promise<Post> {
    const { caption, type, is_hidden } = postCreationDto;
    const post = this.create();
    post.caption = caption;
    post.type = type;
    post.is_hidden = is_hidden;
    post.user_id = userId;
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
        'group.uuid',
        'group.name',
        'option.uuid',
        'option.vote_count',
        'option.body',
      ])
      .where('post.created = :created', { created: true })
      .leftJoin('post.groups', 'group')
      .leftJoin('group.options', 'option')
      .getMany();
  }
  /**
   * flagPostCreation
   */
  public async flagPostCreation(flag: boolean, post: Post): Promise<void> {
    post.created = flag;
    // for now add ready = true whenever flag = true
    // this should be changed later whenever we have implementation for media in post
    if (flag) {
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
        'group.uuid',
        'group.name',
        'option.uuid',
        'option.vote_count',
        'option.body',
      ])
      .leftJoin('post.groups', 'group')
      .leftJoin('group.options', 'option')
      .where('post.uuid = :uuid', { uuid: postid })
      .getOne();

    return post;
  }

  public async getPostById(postId: string): Promise<Post> {
    return await this.createQueryBuilder('post')
      .where('post.uuid = :postId', {
        postId,
      })
      .getOne();
  }
}
