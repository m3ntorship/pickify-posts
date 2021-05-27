import {
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostIdParam } from '../shared/validations/postIdParam.validator';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { PostsService } from './posts.service';
import { OptionsGroups } from './interface/optionsGroup.interface';

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
  flagPost() {
    throw new NotImplementedException();
  }

  @Delete('/:postid')
  deletePost() {
    throw new NotImplementedException();
  }
}
