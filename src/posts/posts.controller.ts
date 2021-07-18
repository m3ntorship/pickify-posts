import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  Request,
  UseFilters,
} from '@nestjs/common';
import { ExtendedRequest } from 'src/shared/interfaces/expressRequest';
import * as winston from 'winston';
import { winstonLoggerOptions } from '../logging/winston.options';
import { ValidationExceptionFilter } from '../shared/exception-filters/validation-exception.filter';
import { PostIdParam } from '../shared/validations/uuid.validator';
import { FlagPostFinishedDto } from './dto/flag-post-finished';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { PostCreationDto } from './dto/postCreation.dto';
import type { Post as GetPost, Posts } from './interfaces/getPosts.interface';
import { OptionsGroups } from './interfaces/optionsGroup.interface';
import type { PostCreation as PostCreationInterface } from './interfaces/postCreation.interface';
import { PostsService } from './posts.service';

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
    @Request() req: ExtendedRequest,
  ): Promise<PostCreationInterface> {
    return this.postsService.createPost(postCreationDto, req.user);
  }

  @Get('/')
  async getAllPosts(@Request() req: ExtendedRequest): Promise<Posts> {
    return await this.postsService.getAllPosts(req.user);
  }

  @Get('/:postid')
  getSinglePost(
    @Param() params: PostIdParam,
    @Request() req: ExtendedRequest,
  ): Promise<GetPost> {
    return this.postsService.getSinglePost(params.postid, req.user);
  }

  @Post('/:postid/groups')
  async createOptionGroup(
    @Param() params: PostIdParam,
    @Body() createGroupsDto: OptionsGroupCreationDto,
    @Headers() headers: { Authorization: string },
  ): Promise<OptionsGroups> {
    const userId = headers.Authorization;
    const createdGroups = await this.postsService.createOptionGroup(
      params.postid,
      createGroupsDto,
      userId,
    );
    return createdGroups;
  }

  @Patch('/:postid')
  @HttpCode(204)
  async flagPost(
    @Param() params: PostIdParam,
    @Body() flagPostDto: FlagPostFinishedDto,
    @Headers() headers: { Authorization: string },
  ): Promise<void> {
    const userId = headers.Authorization;
    await this.postsService.flagPost(
      params.postid,
      flagPostDto.finished,
      userId,
    );
  }

  @Delete('/:postid')
  @HttpCode(204)
  async deletePost(
    @Param() params: PostIdParam,
    @Headers() headers: { Authorization: string },
  ) {
    const userId = headers.Authorization;
    await this.postsService.deletePost(params.postid, userId);
  }
}
