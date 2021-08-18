import { Injectable } from '@nestjs/common';
import { PostRepository } from '../posts/entities/post.repository';
import { Post as Ipost } from '../posts/interfaces/getPosts.interface';
import { UserIdParam } from '../shared/validations/uuid.validator';

@Injectable()
export class UsersService {
  constructor(private postsRepository: PostRepository) {}
  async getPosts(userId: UserIdParam): Promise<Ipost> {
    // const posts = await this.postsRepository.
  }
}
