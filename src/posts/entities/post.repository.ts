import { EntityRepository, Repository } from 'typeorm';
import { PostCreationDto } from '../dto/postCreation.dto';
import { Post } from './post.entity';
import { User } from '../../users/entities/user.entity';
import { QueryParameters } from '../../shared/validations/query.validator';
import { UserPostsInfo } from '../interfaces/getUserPosts.interface';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  //declaring pagination default constants
  readonly LIMIT: number = 10;
  readonly OFFSET: number = 0;

  // check whether all media in post were received and stored or not
  private mediaReadiness(post: Post): boolean {
    const postMedia = [...post.media];
    post.groups.forEach((group) => {
      postMedia.push(...group.media);
      group.options.forEach((option) => {
        postMedia.push(...option.media);
      });
    });

    return post.media_count === postMedia.length;
  }

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
    post.media_count = media_count;
    post.user = user;
    post.created = false;
    post.ready = false;
    return await this.save(post);
  }

  public async getAllPosts(queries: QueryParameters): Promise<Post[]> {
    // according to this comment
    // https://github.com/typeorm/typeorm/issues/4742#issuecomment-783857414
    // we have to use take() and & skip() instead of limit() & offset() as our query uses joins
    // also we had to select post.id, group.id, user.id, option.id & vote.id to make it work with take() & skip()
    // also temporarily, group & option order were commented out as they threw error and required a lot of refactoring to fix this issue.
    return await this.createQueryBuilder('post')
      .select([
        'post.id',
        'post.uuid',
        'post.created',
        'post.ready',
        'post.caption',
        'post.is_hidden',
        'post.created_at',
        'post.type',
        'post_media.url',
        'user.id',
        'user.uuid',
        'user.name',
        'user.profile_pic',
        'group.id',
        'group.uuid',
        'group.name',
        'group_media.url',
        'group.order',
        'option.id',
        'option.uuid',
        'option.vote_count',
        'option.body',
        'option_media.url',
        'option.order',
        'vote.id',
        'vote.uuid',
        'vote_user.uuid',
      ])
      .leftJoin('post.groups', 'group')
      .leftJoin('group.options', 'option')
      .leftJoin('post.user', 'user')
      .leftJoin('option.votes', 'vote')
      .leftJoin('vote.user', 'vote_user')
      .leftJoin('post.media', 'post_media')
      .leftJoin('option.media', 'option_media')
      .leftJoin('group.media', 'group_media')
      .where('post.ready = :ready', { ready: true })
      .orderBy({
        'post.created_at': 'DESC',
      })
      .take(queries.limit || this.LIMIT)
      .skip(queries.offset || this.OFFSET)
      .getMany();
  }
  public async getUserPosts(
    userId: string,
    queries: QueryParameters,
  ): Promise<UserPostsInfo> {
    const posts = await this.createQueryBuilder('post')
      .select([
        'post.id',
        'post.uuid',
        'post.created',
        'post.ready',
        'post.caption',
        'post.is_hidden',
        'post.created_at',
        'post.type',
        'post_media.url',
        'user.id',
        'user.uuid',
        'user.name',
        'user.profile_pic',
        'group.id',
        'group.uuid',
        'group.name',
        'group_media.url',
        'group.order',
        'option.id',
        'option.uuid',
        'option.vote_count',
        'option.body',
        'option_media.url',
        'option.order',
        'vote.id',
        'vote.uuid',
        'vote_user.uuid',
      ])
      .leftJoin('post.groups', 'group')
      .leftJoin('group.options', 'option')
      .leftJoin('post.user', 'user')
      .leftJoin('option.votes', 'vote')
      .leftJoin('vote.user', 'vote_user')
      .leftJoin('post.media', 'post_media')
      .leftJoin('option.media', 'option_media')
      .leftJoin('group.media', 'group_media')
      .where('post.ready = :ready', { ready: true })
      .andWhere('user.uuid= :userId', { userId: userId })
      .andWhere('post.is_hidden= :hidden', { hidden: false })
      .orderBy({
        'post.created_at': 'DESC',
      })
      .take(queries.limit || this.LIMIT)
      .skip(queries.offset || this.OFFSET)
      .getMany();

    const totalPostsCount = await this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .where('post.ready = :ready', { ready: true })
      .andWhere('user.uuid= :userId', { userId: userId })
      .andWhere('post.is_hidden= :hidden', { hidden: false })
      .getCount();
    return {
      totalPostsCount: totalPostsCount,
      posts: posts,
    };
  }
  //getting current user's posts
  public async getCurrentUserPosts(
    userId: string,
    queries: QueryParameters,
  ): Promise<UserPostsInfo> {
    const posts = await this.createQueryBuilder('post')
      .select([
        'post.id',
        'post.uuid',
        'post.created',
        'post.ready',
        'post.caption',
        'post.is_hidden',
        'post.created_at',
        'post.type',
        'post_media.url',
        'user.id',
        'user.uuid',
        'user.name',
        'user.profile_pic',
        'group.id',
        'group.uuid',
        'group.name',
        'group_media.url',
        'group.order',
        'option.id',
        'option.uuid',
        'option.vote_count',
        'option.body',
        'option_media.url',
        'option.order',
        'vote.id',
        'vote.uuid',
        'vote_user.uuid',
      ])
      .leftJoin('post.groups', 'group')
      .leftJoin('group.options', 'option')
      .leftJoin('post.user', 'user')
      .leftJoin('option.votes', 'vote')
      .leftJoin('vote.user', 'vote_user')
      .leftJoin('post.media', 'post_media')
      .leftJoin('option.media', 'option_media')
      .leftJoin('group.media', 'group_media')
      .where('post.ready = :ready', { ready: true })
      .andWhere('user.uuid= :userId', { userId: userId })
      .orderBy({
        'post.created_at': 'DESC',
      })
      .take(queries.limit || this.LIMIT)
      .skip(queries.offset || this.OFFSET)
      .getMany();
    const totalPostsCount = await this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .where('post.ready = :ready', { ready: true })
      .andWhere('user.uuid= :userId', { userId: userId })
      .getCount();
    return {
      totalPostsCount: totalPostsCount,
      posts: posts,
    };
  }

  /**
   * flagPostCreation
   */
  public async flagPostCreation(flag: boolean, post: Post): Promise<void> {
    post.created = flag;

    // make post ready if it has no media or all media got handled
    if (post.media_count === 0) {
      post.ready = true;
    }
    await this.save(post);
  }

  public async getDetailedPostById(postid: string): Promise<Post> {
    const post = await this.createQueryBuilder('post')
      .select([
        'post.id',
        'post.uuid',
        'post.created',
        'post.ready',
        'post.caption',
        'post.media_count',
        'post.ready',
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
        'group.order',
        'option.uuid',
        'option.vote_count',
        'option.body',
        'option.order',
        'option_media.url',
        'vote.uuid',
        'vote_user.uuid',
      ])
      .leftJoin('post.groups', 'group')
      .leftJoin('group.options', 'option')
      .leftJoin('option.votes', 'vote')
      .leftJoin('vote.user', 'vote_user')
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

  public async handleReadiness(postId: string): Promise<void> {
    // get detailed post
    const post = await this.getDetailedPostById(postId);

    // handle post readiness if all post media is received and handled successfully
    const isMediaHandled = this.mediaReadiness(post);

    // here to add any logic if post readiness will depend on it

    // handle post readiness
    if (isMediaHandled) {
      post.ready = true;
      await this.createQueryBuilder()
        .update(Post)
        .set({ ready: true })
        .where('uuid = :uuid', { uuid: postId })
        .execute();
    }
  }
  public async getPostsReports(): Promise<Post[]> {
    return await this.createQueryBuilder('post')
      .select([
        'post.id',
        'post.uuid',
        'post.created',
        'post.ready',
        'post.caption',
        'post.is_hidden',
        'post.created_at',
        'post.type',
        'reports.uuid',
        'reporter.name',
        'reporter.uuid',
        'post_media.url',
        'user.id',
        'user.uuid',
        'user.name',
        'user.profile_pic',
        'group.id',
        'group.uuid',
        'group.name',
        'group_media.url',
        'group.order',
        'option.id',
        'option.uuid',
        'option.vote_count',
        'option.body',
        'option_media.url',
        'option.order',
      ])
      .leftJoin('post.groups', 'group')
      .leftJoin('group.options', 'option')
      .leftJoin('post.user', 'user')
      .leftJoin('post.media', 'post_media')
      .leftJoin('group.media', 'group_media')
      .leftJoin('option.media', 'option_media')
      .leftJoin('post.postsReports', 'reports')
      .leftJoin('reports.reporter', 'reporter')
      .where('post.ready = :ready', { ready: true })
      .groupBy('post.id')
      .addGroupBy('reports.id')
      .addGroupBy('reporter.id')
      .addGroupBy('group.id')
      .addGroupBy('option.id')
      .addGroupBy('user.id')
      .addGroupBy('post_media.id')
      .addGroupBy('group_media.id')
      .addGroupBy('option_media.id')
      .having('COUNT(reports) > :count', { count: 0 })
      .getMany();
  }
}
