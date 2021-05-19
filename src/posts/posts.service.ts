import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import type { CreatePost as CreatePostInterface } from './interfaces/createPost.interface';

@Injectable()
export class PostsService {
  async createPost(createPostDto: CreatePostDto): Promise<CreatePostInterface> {
    return { id: 'test' };
  }
}
