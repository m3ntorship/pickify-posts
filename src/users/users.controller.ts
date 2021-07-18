import { Controller, Post, Request } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post('/register')
  createUser(@Request() req) {
    return req.user;
  }
}
