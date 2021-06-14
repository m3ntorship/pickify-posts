import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
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
    return await this.createQueryBuilder('posts')
      .select([
        'posts.uuid',
        'posts.created',
        'posts.caption',
        'posts.is_hidden',
        'posts.created_at',
        'posts.type',
        'groups.uuid',
        'groups.name',
        'options.uuid',
        'options.vote_count',
        'options.body',
      ])
      .where('posts.created = :created', { created: true })
      .leftJoin('posts.groups', 'groups')
      .leftJoin('groups.options', 'options')
      .getMany();
  }
  /**
   * flagPostCreation
   */
  public async flagPostCreation(flag: boolean, postid: string): Promise<void> {
    const post = await this.findOne({
      where: { uuid: postid },
      relations: ['groups', 'groups.options'],
    });
    if (!post) throw new NotFoundException(`Post with id: ${postid} not found`);
    post.created = flag;
    post.ready = true;
    await this.save(post);
  }

  public async deletePost(postid: string, userId: number): Promise<void> {
    // get post from DB
    const post = await this.findOne({ where: { uuid: postid } });

    // Check whether there is a post with the passed id
    if (!post) {
      throw new NotFoundException(`Post with id:${postid} not found`);
    }

    // Check if current user is the owner of the post
    if (post.user_id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    // remove post
    await Post.remove(post);
  }
  public async getSinglePost(postid: string): Promise<Post> {
    const post = await this.createQueryBuilder('posts')
      .select([
        'posts.uuid',
        'posts.created',
        'posts.caption',
        'posts.is_hidden',
        'posts.created_at',
        'posts.type',
        'groups.uuid',
        'groups.name',
        'options.uuid',
        'options.vote_count',
        'options.body',
      ])
      .leftJoin('posts.groups', 'groups')
      .leftJoin('groups.options', 'options')
      .where('posts.uuid = :uuid', { uuid: postid })
      .getOne();

    if (!post) throw new NotFoundException(`Post with id: ${postid} not found`);

    // don't return post if post.created = false
    if (!post.created)
      throw new HttpException(
        `Post with id: ${postid} still under creation...`,
        423,
      );
    return post;
  }
}
