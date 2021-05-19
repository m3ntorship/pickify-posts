import {
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import type { CreatePost as CreatePostInterface } from './interfaces/createPost.interface';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('/')
  createPost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<CreatePostInterface> {
    return this.postsService.createPost(createPostDto);
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
  flagPost() {
    throw new NotImplementedException();
  }

  @Delete('/:postid')
  deletePost() {
    throw new NotImplementedException();
  }
}
