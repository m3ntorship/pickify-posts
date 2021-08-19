import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../posts/entities/post.repository';
import { Post as Ipost, Posts } from '../posts/interfaces/getPosts.interface';
import { UserIdParam } from '../shared/validations/uuid.validator';
import { Post as PostEntity } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';
import { QueryParameters } from '../shared/validations/query.validator';
import { UserRepository } from './entities/user.repository';
@Injectable()
export class UsersService {
  constructor(
    private postsRepository: PostRepository,
    private postService: PostsService,
    private userRepository: UserRepository,
  ) {}

  async getUserPosts(userid: string, queries: QueryParameters): Promise<Posts> {
    //check if user exist or not

    const user = await this.userRepository.getUser(userid);
    if (!user) throw new NotFoundException(`User with id: ${userid} not found`);

    // get user posts from DB
    const currentPosts: PostEntity[] = await this.postsRepository.getUserPosts(
      userid,
      queries,
    );

    return {
      postsCount: currentPosts.length,
      // is this part can be modified as all the current posts relate to the same user?
      posts: currentPosts.map((post) => {
        return this.postService.handlePostFeatures(post, userid);
      }),
    };
  }
}
