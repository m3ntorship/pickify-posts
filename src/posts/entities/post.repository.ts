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

  /**
   * flagPostCreation
   */
  public async flagPostCreation(flag: boolean, postid: string): Promise<void> {
    const post = await this.findOne({ where: { uuid: postid } });
    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    post.created = flag;
    await this.save(post);
  }
}
