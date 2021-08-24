import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../posts/entities/post.repository';
import { Post as Ipost, Posts } from '../posts/interfaces/getPosts.interface';
import { UserIdParam } from '../shared/validations/uuid.validator';
import { Post as PostEntity } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';
import { QueryParameters } from '../shared/validations/query.validator';
import { UserRepository } from './entities/user.repository';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    private postsRepository: PostRepository,
    private postService: PostsService,
    private userRepository: UserRepository,
  ) {}

  async getUserPosts(
    userid: string,
    queries: QueryParameters,
    user: User,
  ): Promise<Posts> {
    //check if user exist or not
    const userToFind = await this.userRepository.getUser(userid);

    //checking if user is in the database
    if (!userToFind)
      throw new NotFoundException(`User with id: ${userid} not found`);

    let currentPosts: PostEntity[];

    if (userid === user.uuid) {
      currentPosts = await this.postsRepository.getCurrentUserPosts(
        userid,
        queries,
      );
    } else {
      currentPosts = await this.postsRepository.getUserPosts(userid, queries);
    }
    return {
      postsCount: currentPosts.length,
      // is this part can be modified as all the current posts relate to the same user?
      posts: currentPosts.map((post) => {
        return this.postService.handlePostFeatures(post, userid);
      }),
    };
  }
}
