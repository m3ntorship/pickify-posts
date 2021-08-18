import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { Post as Ipost } from 'src/posts/interfaces/getPosts.interface';
import { UserIdParam } from '../shared/validations/uuid.validator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('/register')
  createUser(@Request() req) {
    return req.user;
  }

  @Get(':userId/posts')
  async getPosts(@Param('userId') userId: UserIdParam): Promise<Ipost> {
    return await this.userService.getPosts(userId);
  }
}
