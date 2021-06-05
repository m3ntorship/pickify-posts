import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { PostCreationDto } from '../dto/postCreation.dto';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
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
}
