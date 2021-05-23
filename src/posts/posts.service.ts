import { Injectable } from '@nestjs/common';
import { PostCreationDto } from './dto/postCreation.dto';
import { PostRepository } from './entities/post.repository';
import type { PostCreation as PostCreationInterface } from './interfaces/postCreation.interface';

@Injectable()
export class PostsService {
  constructor(private postRepository: PostRepository) {}
  async createPost(
    postCreationDto: PostCreationDto,
  ): Promise<PostCreationInterface> {
    const createdPost = await this.postRepository.createPost(postCreationDto);
    return { id: createdPost.uuid };
  }
}
