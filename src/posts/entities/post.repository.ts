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
  public async flagPostCreation(flag: boolean, post: Post): Promise<void> {
    post.created = flag;
    // for now add ready = true whenever flag = true
    // this should be changed later whenever we have implementation for media in post
    if (flag) {
      post.ready = true;
    }
    await this.save(post);
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

    return post;
  }

  public async findPostById(postId: string): Promise<Post> {
    return await this.createQueryBuilder('post')
      .where('post.uuid = :postId', {
        postId,
      })
      .getOne();
  }
}
