import {
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { PostCreationDto } from './dto/postCreation.dto';
import type { PostCreation as PostCreationInterface } from './interfaces/postCreation.interface';
import { PostsService } from './posts.service';
import { ValidationExceptionFilter } from '../shared/exception-filters/validation-exception.filter';
import * as winston from 'winston';
import { winstonLoggerOptions } from '../logging/winston.options';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  logger = winston.createLogger(winstonLoggerOptions);

  @Post('/')
  @UseFilters(
    new ValidationExceptionFilter(winston.createLogger(winstonLoggerOptions)),
  )
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
