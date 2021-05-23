import {
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Patch,
  Post,
} from '@nestjs/common';
import { PostCreationDto } from './dto/postCreation.dto';
import type { PostCreation as PostCreationInterface } from './interfaces/postCreation.interface';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('/')
  createPost(
    @Body() postCreationDto: PostCreationDto,
  ): Promise<PostCreationInterface> {
    return this.postsService.createPost(postCreationDto);
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
