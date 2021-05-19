import {
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostIdParam } from '../validations/postIdParam.validator';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('/')
  createPost() {
    throw new NotImplementedException();
  }

  @Get('/')
  getAllPosts() {
    throw new NotImplementedException();
  }

  @Get('/:postid')
  getSinglePost() {
    throw new NotImplementedException();
  }

  @Post('/:postid/groups')
  createOptionGroup() {
    throw new NotImplementedException();
  }

  @Patch('/:postid')
  flagPost(@Param() params: PostIdParam) {
    throw new NotImplementedException();
  }

  @Delete('/:postid')
  deletePost() {
    throw new NotImplementedException();
  }
}
