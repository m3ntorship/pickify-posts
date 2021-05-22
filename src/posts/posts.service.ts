import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostRepository } from './entities/post.repository';
import type { CreatePost as CreatePostInterface } from './interfaces/createPost.interface';

@Injectable()
export class PostsService {
  constructor(private postRepository: PostRepository) {}
  async createPost(createPostDto: CreatePostDto): Promise<CreatePostInterface> {
    const createdPost = await this.postRepository.createPost(createPostDto);
    return { id: createdPost.uuid };
  }
}
