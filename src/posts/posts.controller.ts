import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  UseFilters,
  Post,
} from '@nestjs/common';
import { PostIdParam } from '../shared/validations/uuid.validator';
import { PostsService } from './posts.service';
import { FlagPostFinishedDto } from './dto/flag-post-finished';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { OptionsGroups } from './interfaces/optionsGroup.interface';
import { PostCreationDto } from './dto/postCreation.dto';
import type { PostCreation as PostCreationInterface } from './interfaces/postCreation.interface';
import { ValidationExceptionFilter } from '../shared/exception-filters/validation-exception.filter';
import * as winston from 'winston';
import { winstonLoggerOptions } from '../logging/winston.options';
import type { Posts } from './interfaces/getPosts.interface';

@Controller('posts')
@UseFilters(
  new ValidationExceptionFilter(winston.createLogger(winstonLoggerOptions)),
)
export class PostsController {
  constructor(private postsService: PostsService) {}
  logger = winston.createLogger(winstonLoggerOptions);

  @Post('/')
  createPost(
    @Body() postCreationDto: PostCreationDto,
  ): Promise<PostCreationInterface> {
    return this.postsService.createPost(postCreationDto);
  }

  @Get('/')
  async getAllPosts(): Promise<Posts> {
    return await this.postsService.getAllPosts();
  }

  @Get('/:postid')
  getSinglePost(@Param() params: PostIdParam) {
    return this.postsService.getSinglePost(params.postid);
  }

  @Post('/:postid/groups')
  async createOptionGroup(
    @Param() params: PostIdParam,
    @Body() createGroupsDto: OptionsGroupCreationDto,
  ): Promise<OptionsGroups> {
    const createdGroups = await this.postsService.createOptionGroup(
      params.postid,
      createGroupsDto,
    );
    return createdGroups;
  }

  @Patch('/:postid')
  @HttpCode(204)
  async flagPost(
    @Param() params: PostIdParam,
    @Body() flagPostDto: FlagPostFinishedDto,
  ): Promise<void> {
    await this.postsService.flagPost(params, flagPostDto);
  }

  @Delete('/:postid')
  @HttpCode(204)
  async deletePost(@Param() params: PostIdParam) {
    await this.postsService.deletePost(params.postid);
  }
}
