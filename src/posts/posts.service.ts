import { PostCreationDto } from './dto/postCreation.dto';
import { PostRepository } from './entities/post.repository';
import type { PostCreation as PostCreationInterface } from './interfaces/postCreation.interface';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { OptionRepository } from './entities/option.repository';
import { OptionsGroupRepository } from './entities/optionsGroup.repository';
import { OptionsGroups } from './interfaces/optionsGroup.interface';
import type { Group, Post, Posts } from './interfaces/getPosts.interface';
import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostIdParam } from '../shared/validations/uuid.validator';
import { FlagPostFinishedDto } from './dto/flag-post-finished';

@Injectable()
export class PostsService {
  constructor(
    private postRepository: PostRepository,
    private optionRepository: OptionRepository,
    private groupRepository: OptionsGroupRepository,
  ) {}

  private modifyGroupsData(post): Group[] {
    const groups: Group[] = post.groups.map((obj) => {
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
    return groups;
  }

  async createPost(
    postCreationDto: PostCreationDto,
    userId: number,
  ): Promise<PostCreationInterface> {
    const createdPost = await this.postRepository.createPost(
      postCreationDto,
      userId,
    );
    return { id: createdPost.uuid };
  }

  async flagPost(
    params: PostIdParam,
    flagPostDto: FlagPostFinishedDto,
  ): Promise<void> {
    // get post
    const post = await this.postRepository.findPostById(params.postid);

    // check whether post is found
    if (!post) {
      throw new NotFoundException(`Post with id: ${params.postid} not found`);
    }

    await this.postRepository.flagPostCreation(flagPostDto.finished, post);
  }

  async deletePost(postid: string, userId: number): Promise<void> {
    // get post
    const post = await this.postRepository.findPostById(postid);

    // check whether post is found
    if (!post) {
      throw new NotFoundException(`Post with id: ${postid} not found`);
    }

    // Check if current user is the owner of the post
    if (post.user_id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    await this.postRepository.remove(post);
  }

  async createOptionGroup(
    postid: string,
    groupsCreationDto: OptionsGroupCreationDto,
  ): Promise<OptionsGroups> {
    const response: OptionsGroups = { groups: [] };

    // get post
    const post = await this.postRepository.findPostById(postid);

    // check whether post found
    if (!post) {
      throw new NotFoundException(`Post with id: ${postid} not found`);
    }

    // Loop through all groups
    for (let i = 0; i < groupsCreationDto.groups.length; i++) {
      const group = groupsCreationDto.groups[i];
      const createdGroup = await this.groupRepository.createGroup(
        post,
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
  async getAllPosts(): Promise<Posts> {
    let currentPosts = await this.postRepository.getAllPosts();

    currentPosts = currentPosts.filter((post) => post.created);

    const response: Posts = { postsCount: currentPosts.length, posts: [] };
    for (let i = 0; i < currentPosts.length; i++) {
      const post = currentPosts[i];
      // call function to modify group data
      const groups: Group[] = this.modifyGroupsData(post);
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
  async getSinglePost(postId: string): Promise<Post> {
    const post = await this.postRepository.getSinglePost(postId);

    // check whether post is found
    if (!post) throw new NotFoundException(`Post with id: ${postId} not found`);

    // don't return post if post.created = false
    if (!post.created) {
      throw new HttpException(
        `Post with id: ${postId} still under creation...`,
        423,
      );
    }
    const postUuid = post.uuid;
    delete post['uuid'];
    delete post['created'];
    //calling function to modify groups data
    const groups: Group[] = this.modifyGroupsData(post);

    //deleting old groups
    delete post['groups'];

    return {
      id: postUuid,
      ...(post as any),
      options_groups: { groups: groups },
    };
  }
}
