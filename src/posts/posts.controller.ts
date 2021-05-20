import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotImplementedException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostIdParam } from '../validations/postIdParam.validator';
import { PostsService } from './posts.service';
import { FlagPostFinishedDto } from './dto/flag-post-finished';

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
  @HttpCode(204)
  async flagPost(
    @Param() params: PostIdParam,
    @Body() flagPostDto: FlagPostFinishedDto,
  ) {
    await this.postsService.flagPost(params, flagPostDto);
  }

  @Delete('/:postid')
  deletePost() {
    throw new NotImplementedException();
  }
}
