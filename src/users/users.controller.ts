import { Query } from '@nestjs/common';
import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ExtendedRequest } from '../shared/interfaces/expressRequest';
import { Post as Ipost, Posts } from '../posts/interfaces/getPosts.interface';
import { QueryParameters } from '../shared/validations/query.validator';
import { UserIdParam } from '../shared/validations/uuid.validator';
import { UsersService } from './users.service';
import { UserPosts } from './interfaces/userPosts.interface';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('/register')
  createUser(@Request() req) {
    return req.user;
  }

  @Get(':userId/posts')
  async getPosts(
    @Param() params: UserIdParam,
    @Query() queries: QueryParameters,
    @Request() req: ExtendedRequest,
  ): Promise<UserPosts> {
    return await this.userService.getUserPosts(
      params.userId,
      queries,
      req.user,
    );
  }
}
