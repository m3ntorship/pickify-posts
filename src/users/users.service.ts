import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../posts/entities/post.repository';
import { Post as Ipost, Posts } from '../posts/interfaces/getPosts.interface';
import { UserIdParam } from '../shared/validations/uuid.validator';
import { Post as PostEntity } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';
import { QueryParameters } from '../shared/validations/query.validator';
import { UserRepository } from './entities/user.repository';
import { User } from './entities/user.entity';
import { User as Iuser } from './interfaces/userPosts.interface';
import { UserPosts } from './interfaces/userPosts.interface';
import { UserPostsInfo } from '../posts/interfaces/getUserPosts.interface';
@Injectable()
export class UsersService {
  constructor(
    private postsRepository: PostRepository,
    private postService: PostsService,
    private userRepository: UserRepository,
  ) {}
  private modifyUser(user: User): Iuser {
    return {
      id: user.uuid,
      name: user.name,
      profile_pic: user.profile_pic,
      created_at: user.created_at,
    };
  }
  async getUserPosts(
    userid: string,
    queries: QueryParameters,
    user: User,
  ): Promise<UserPosts> {
    //check if user exist or not
    const userToFind = await this.userRepository.getUser(userid);

    //checking if user is in the database
    if (!userToFind)
      throw new NotFoundException(`User with id: ${userid} not found`);

    let userPostsInfo: UserPostsInfo;

    if (userid === user.uuid) {
      userPostsInfo = await this.postsRepository.getCurrentUserPosts(
        userid,
        queries,
      );
    } else {
      userPostsInfo = await this.postsRepository.getUserPosts(userid, queries);
    }
    return {
      user: this.modifyUser(userToFind),
      totalPostsCount: userPostsInfo.totalPostsCount,
      postsCount: userPostsInfo.posts.length,
      posts: userPostsInfo.posts.map((post) => {
        return this.postService.handlePostFeatures(post, userid);
      }),
    };
  }
}
