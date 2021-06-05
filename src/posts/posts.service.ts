import { PostCreationDto } from './dto/postCreation.dto';
import { PostRepository } from './entities/post.repository';
import type { PostCreation as PostCreationInterface } from './interfaces/postCreation.interface';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { OptionRepository } from './entities/option.repository';
import { OptionsGroupRepository } from './entities/optionsGroup.repository';
import { OptionsGroups } from './interfaces/optionsGroup.interface';
import { Injectable } from '@nestjs/common';
import { PostIdParam } from '../shared/validations/postIdParam.validator';
import { FlagPostFinishedDto } from './dto/flag-post-finished';

@Injectable()
export class PostsService {
  constructor(
    private postRepository: PostRepository,
    private optionRepository: OptionRepository,
    private groupRepository: OptionsGroupRepository,
  ) {}

  async createPost(
    postCreationDto: PostCreationDto,
  ): Promise<PostCreationInterface> {
    const createdPost = await this.postRepository.createPost(postCreationDto);
    return { id: createdPost.uuid };
  }

  async flagPost(
    params: PostIdParam,
    flagPostDto: FlagPostFinishedDto,
  ): Promise<void> {
    await this.postRepository.flagPostCreation(
      flagPostDto.finished,
      params.postid,
    );
  }

  async createOptionGroup(
    postid: string,
    groupsCreationDto: OptionsGroupCreationDto,
  ): Promise<OptionsGroups> {
    const response: OptionsGroups = { groups: [] };
    // Loop through all groups
    for (let i = 0; i < groupsCreationDto.groups.length; i++) {
      const group = groupsCreationDto.groups[i];
      const createdGroup = await this.groupRepository.createGroup(
        postid,
        group.name,
      );
      // Add the group uuid to the response
      response.groups.push({ id: createdGroup.uuid, options: [] });
      // Create Multiple options for the group
      for (let j = 0; j < group.options.length; j++) {
        const option = group.options[j];
        const createdOption = await this.optionRepository.createOption(
          createdGroup,
          option,
        );
        response.groups[i].options.push({ id: createdOption.uuid });
      }
    }
    return response;
  }
}
