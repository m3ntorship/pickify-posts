import { Controller, Get, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import admin from 'firebase-admin';

@Controller('users')
export class UsersController {
  constructor(private userSerivce: UsersService) {}

  @Post('/register')
  createUser(@Request() req) {
    return this.userSerivce.createUser(req);
  }
}
