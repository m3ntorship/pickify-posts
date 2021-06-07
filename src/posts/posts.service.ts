import { PostCreationDto } from './dto/postCreation.dto';
import { PostRepository } from './entities/post.repository';
import type { PostCreation as PostCreationInterface } from './interfaces/postCreation.interface';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { OptionRepository } from './entities/option.repository';
import { OptionsGroupRepository } from './entities/optionsGroup.repository';
import { OptionsGroups } from './interfaces/optionsGroup.interface';
import {
  group,
  option,
  optionsGroup,
  post,
  posts,
} from './interfaces/getPosts.interface';
import { response } from 'express';
import { FORMERR } from 'node:dns';
import { Injectable } from '@nestjs/common';
import { PostIdParam } from '../shared/validations/uuid.validator';
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

  async deletePost(postid: string): Promise<void> {
    await this.postRepository.deletePost(postid);
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
  async getAllPosts(): Promise<posts> {
    const currentPosts = await this.postRepository.getAllPosts();

    const response: posts = { postsCount: currentPosts.length, posts: [] };
    for (let i = 0; i < currentPosts.length; i++) {
      const post = currentPosts[i];

      //modifying groups and options returned data
      const groups: group[] = post.groups.map((obj) => {
        const groupUuid = obj['uuid'];
        delete obj['uuid'];
        const options = obj.options.map((option) => {
          const optionUuid = option['uuid'];
          delete option['uuid'];
          return { id: optionUuid, ...(option as any) };
        });
        delete obj['options'];
        return { id: groupUuid, options: options, ...(obj as any) };
      });

      response.posts.push({
        id: post.uuid,
        caption: post.caption,
        is_hidden: post.is_hidden,
        created_at: post.created_at,
        type: post.type,
        options_groups: { groups: groups },
      });
    }
    return response;
  }
  async getSinglePost(postId: string): Promise<post> {
    const post = await this.postRepository.getSinglePost(postId);
    const postUuid = post.uuid;
    delete post['uuid'];

    // modifying groups data
    const groups: group[] = post.groups.map((obj) => {
      const groupUuid = obj['uuid'];
      delete obj['uuid'];
      const options = obj.options.map((option) => {
        const optionUuid = option['uuid'];
        delete option['uuid'];
        return { id: optionUuid, ...(option as any) };
      });
      delete obj['options'];
      return { id: groupUuid, options: options, ...(obj as any) };
    });
    return { id: postUuid, ...(post as any), options_groups: groups };
  }
}
