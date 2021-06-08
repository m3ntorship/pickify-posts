import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PostCreationDto } from '../dto/postCreation.dto';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  /**
   * createPost
   */
  public async createPost(postCreationDto: PostCreationDto): Promise<Post> {
    const { caption, type, is_hidden } = postCreationDto;
    const post = this.create();
    post.caption = caption;
    post.type = type;
    post.is_hidden = is_hidden;
    post.user_id = 1;
    post.created = false;
    post.ready = false;
    return await this.save(post);
  }
  public async getAllPosts(): Promise<Post[]> {
    const posts = await this.createQueryBuilder('posts')
      .select([
        'posts.uuid',
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
      .getMany();
    return posts;
  }
  /**
   * flagPostCreation
   */
  public async flagPostCreation(flag: boolean, postid: string): Promise<void> {
    const post = await this.findOne({ where: { uuid: postid } });
    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    post.created = flag;
    await this.save(post);
  }

  public async deletePost(postid: string): Promise<void> {
    try {
      const post = await this.findOneOrFail({ where: { uuid: postid } });
      await Post.remove(post);
    } catch (error) {
      if (error.name === 'EntityNotFound')
        throw new NotFoundException(error.message);
      else throw new InternalServerErrorException();
    }
  }
  public async getSinglePost(postid: string): Promise<Post> {
    try {
      const post = await this.createQueryBuilder('posts')
        .select([
          'posts.uuid',
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
        .getOneOrFail();
      return post;
    } catch (error) {
      if (error.name === 'EntityNotFound')
        throw new NotFoundException('post not found');
      else throw new InternalServerErrorException();
    }
  }
}
