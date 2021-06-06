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
  UseFilters,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { FlagPostFinishedDto } from './dto/flag-post-finished';
import { PostIdParam } from '../shared/validations/postIdParam.validator';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { OptionsGroups } from './interfaces/optionsGroup.interface';
import { PostCreationDto } from './dto/postCreation.dto';
import type { PostCreation as PostCreationInterface } from './interfaces/postCreation.interface';
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
