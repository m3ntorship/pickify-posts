import { PostCreationDto } from './dto/postCreation.dto';
import { PostRepository } from './entities/post.repository';
import type { PostCreation as PostCreationInterface } from './interfaces/postCreation.interface';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { OptionRepository } from './entities/option.repository';
import { OptionsGroupRepository } from './entities/optionsGroup.repository';
import { OptionsGroups } from './interfaces/optionsGroup.interface';
import type {
  Group,
  Post,
  Posts,
  Option,
} from './interfaces/getPosts.interface';
import { Option as OptionEntity } from './entities/option.entity';
import { OptiosnGroup as OptionGroupEntity } from './entities/optionsGroup.entity';
import { Post as PostEntity } from './entities/post.entity';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { isUserAuthorized } from '../shared/authorization/userAuthorization';
import { LockedException } from '../shared/exceptions/locked.exception';
import { UserRepository } from './entities/user.repository';

@Injectable()
export class PostsService {
  constructor(
    private postRepository: PostRepository,
    private optionRepository: OptionRepository,
    private groupRepository: OptionsGroupRepository,
    private userRepository: UserRepository,
  ) {}

  private handleGroupsCoverage(
    groups: OptionGroupEntity[],
    userId: string,
  ): Group[] {
    function isUserVotedInGroup(group: OptionGroupEntity): boolean {
      return group.options.some((option) => {
        if (option.vote_count > 0) {
          return option.votes.some((vote) => {
            return vote.user.uuid === userId;
          });
        }
        return false;
      });
    }
    function isOptionVoted(option: OptionEntity, userId: string): boolean {
      return option.votes.some((vote) => {
        return vote.user.uuid === userId;
      });
    }

    return groups.map((group: OptionGroupEntity) => {
      let options: Option[];
      // if voted in this group, return all vote_count with each option
      if (isUserVotedInGroup(group)) {
        options = group.options.map((option: OptionEntity) => {
          const isVoted: boolean = isOptionVoted(option, userId);
          return {
            id: option.uuid,
            body: option.body,
            vote_count: option.vote_count,
            voted: isVoted,
          };
        });
      } else {
        options = group.options.map((option: OptionEntity) => ({
          id: option.uuid,
          body: option.body,
        }));
      }
      // return each group as found in interface
      return {
        id: group.uuid,
        name: group.name,
        options,
      };
    });
  }

  private modifyGroupsData(currGroups: OptionGroupEntity[]): Group[] {
    const groups: Group[] = currGroups.map((group: OptionGroupEntity) => {
      // Loop through all options in each group and return a new option as found in the interface
      const options: Option[] = group.options.map((option: OptionEntity) => ({
        id: option.uuid,
        body: option.body,
        vote_count: option.vote_count,
      }));

      // return each group as found in interface
      return {
        id: group.uuid,
        name: group.name,
        options,
      };
    });
    return groups;
  }

  private handlePostFeatures(post: PostEntity, userId: string): Post {
    let returnedPost: Post;

    // check whether user is post owner
    const isPostOwner: boolean = isUserAuthorized(post, userId);

    // if user is post owner
    if (isPostOwner) {
      returnedPost = {
        id: post.uuid,
        user: {
          id: post.user.uuid,
          name: post.user.name,
          profile_pic: post.user.profile_pic,
        },
        caption: post.caption,
        is_hidden: post.is_hidden,
        created_at: post.created_at,
        type: post.type,
        options_groups: { groups: this.modifyGroupsData(post.groups) },
      };
    } else {
      // handle group coverage as follow
      // if user voted in a group, return vote_count with each option, else dont return vote_count
      const groups = this.handleGroupsCoverage(post.groups, userId);

      returnedPost = {
        id: post.uuid,
        user: {
          id: post.user.uuid,
          name: post.user.name,
          profile_pic: post.user.profile_pic,
        },
        caption: post.caption,
        is_hidden: post.is_hidden,
        created_at: post.created_at,
        type: post.type,
        options_groups: { groups: groups },
      };

      // handle wether post is anynoumous
      if (post.is_hidden) {
        returnedPost = {
          id: post.uuid,

          caption: post.caption,
          is_hidden: post.is_hidden,
          created_at: post.created_at,
          type: post.type,
          options_groups: { groups: groups },
        };
      }
    }

    return returnedPost;
  }

  async createPost(
    postCreationDto: PostCreationDto,
    userId: string,
  ): Promise<PostCreationInterface> {
    // get user to add post to it
    const user = await this.userRepository.findOne({ where: { uuid: userId } });

    // create the post
    const createdPost = await this.postRepository.createPost(
      postCreationDto,
      user,
    );
    return { id: createdPost.uuid };
  }

  async flagPost(postId: string, flag: boolean, userId: string): Promise<void> {
    // get post
    const post = await this.postRepository.getPostById(postId);

    // check whether post is found
    if (!post) {
      throw new NotFoundException(`Post with id: ${postId} not found`);
    }

    // Allw only post owner to continue
    if (!isUserAuthorized(post, userId)) {
      throw new UnauthorizedException('Unauthorized');
    }

    await this.postRepository.flagPostCreation(flag, post);
  }

  async deletePost(postid: string, userId: string): Promise<void> {
    // get post
    const post = await this.postRepository.getPostById(postid);

    // check whether post is found
    if (!post) {
      throw new NotFoundException(`Post with id: ${postid} not found`);
    }

    // Check if current user is the owner of the post
    if (!isUserAuthorized(post, userId)) {
      throw new UnauthorizedException('Unauthorized');
    }

    await this.postRepository.remove(post);
  }

  async createOptionGroup(
    postid: string,
    groupsCreationDto: OptionsGroupCreationDto,
    userId: string,
  ): Promise<OptionsGroups> {
    const response: OptionsGroups = { groups: [] };

    // get post
    const post = await this.postRepository.getPostById(postid);

    // check whether post found
    if (!post) {
      throw new NotFoundException(`Post with id: ${postid} not found`);
    }

    // Allw only post owner to continue
    if (!isUserAuthorized(post, userId)) {
      throw new UnauthorizedException('Unauthorized');
    }

    let groupOrder = 0;

    // Add each group to DB along with its options
    for (const group of groupsCreationDto.groups) {
      // create group
      const createdGroup = await this.groupRepository.createGroup(
        post,
        group,
        groupOrder++,
      );

      // create options
      const options = await this.optionRepository.createBulk(
        group.options,
        createdGroup,
      );

      // Add the group uuid and options uuids to the response
      response.groups.push({
        id: createdGroup.uuid,
        options: options.map((option: OptionEntity) => ({ id: option.uuid })),
      });
    }

    return response;
  }

  async getAllPosts(): Promise<Posts> {
    // get all posts from DB
    const currentPosts = await this.postRepository.getAllPosts();

    return {
      postsCount: currentPosts.length,
      // return all posts after modifiying each one as found in openAPI
      posts: currentPosts.map((post) => {
        // Get the modified groups for each post
        const groups: Group[] = this.modifyGroupsData(post.groups);
        return {
          id: post.uuid,
          user: {
            id: post.user.uuid,
            name: post.user.name,
            profile_pic: post.user.profile_pic,
          },
          caption: post.caption,
          is_hidden: post.is_hidden,
          created_at: post.created_at,
          type: post.type,
          options_groups: { groups: groups },
        };
      }),
    };
  }

  async getSinglePost(postId: string, userId: string): Promise<Post> {
    const post = await this.postRepository.getDetailedPostById(postId);
    // check whether post is found
    if (!post) throw new NotFoundException(`Post with id: ${postId} not found`);

    // don't return post if post.ready = false
    if (!post.ready) {
      throw new LockedException(
        `Post with id: ${postId} still under creation...`,
      );
    }

    return this.handlePostFeatures(post, userId);
  }
}
