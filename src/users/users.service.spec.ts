import { Test, TestingModule } from '@nestjs/testing';
import { QueryParameters } from '../shared/validations/query.validator';
import { OptionRepository } from '../posts/entities/option.repository';
import { OptionsGroupRepository } from '../posts/entities/optionsGroup.repository';
import { PostRepository } from '../posts/entities/post.repository';
import { PostsService } from '../posts/posts.service';
import { User } from '../users/entities/user.entity';
import { UserRepository } from './entities/user.repository';
import { UsersService } from './users.service';
import { getNow } from '../shared/utils/datetime';
import { Post } from '../posts/interfaces/getPosts.interface';

describe('UserService', () => {
  let service: UsersService;
  const postRepo = {
    getCurrentUserPosts: jest.fn(),
    getUserPosts: jest.fn(),
  };
  const postService = {
    handlePostFeatures: jest.fn(),
  };
  const userRepo = {
    getUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: PostRepository, useValue: postRepo },
        { provide: PostsService, useValue: postService },
        { provide: UserRepository, useValue: userRepo },
        UsersService,
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service).toHaveProperty('getUserPosts');
  });

  describe('getUsersPosts function', () => {
    it('should return object of posts count and array of posts', async () => {
      //data
      const userid = 'user-id';
      const query = { limit: 10, offset: 0 } as QueryParameters;
      const currentUser = { uuid: 'user2-uuid' } as User;
      const userToFind = {
        uuid: 'user-id',
        name: 'user-name',
        profile_pic: 'user-pic',
        created_at: getNow().toDate(),
      } as User;
      const modifiedUser = {
        id: userToFind.uuid,
        name: userToFind.name,
        profile_pic: userToFind.profile_pic,
        created_at: userToFind.created_at,
      };

      const post = {
        uuid: 'test-post-uuid',
        ready: true,
        caption: 'test-post-caption',
        is_hidden: false,
        created_at: getNow().toDate(),
        type: 'text poll',
        user: {
          uuid: userid,
          name: 'test',
          profile_pic: 'test-url',
        },
        media: [{ url: 'test-media-url' }],
        groups: [
          {
            uuid: 'test-group-uuid',
            name: 'test-group-name',
            options: [
              {
                vote_count: 2,
                body: 'test-option-body',
                uuid: 'test-option-uuid',
                voted: false,
              },
            ],
          },
        ],
      };
      const postsInDB = [post];
      const modifiedPost: Post = {
        id: post.uuid,
        caption: post.caption,
        is_hidden: post.is_hidden,
        created_at: post.created_at,
        type: post.type,
        user: {
          id: post.user.uuid,
          name: post.user.name,
          profile_pic: post.user.profile_pic,
        },
        media: post.media,
        options_groups: {
          groups: [
            {
              id: post.groups[0].uuid,
              name: post.groups[0].name,
              options: [
                {
                  id: post.groups[0].options[0].uuid,
                  body: post.groups[0].options[0].body,
                  vote_count: post.groups[0].options[0].vote_count,
                  voted: post.groups[0].options[0].voted,
                },
              ],
            },
          ],
        },
      };
      const returnedPosts = {
        user: modifiedUser,
        postsCount: postsInDB.length,
        posts: [modifiedPost],
      };

      //mocks

      userRepo.getUser.mockResolvedValue(userToFind);
      if (userid === currentUser.uuid) {
        postRepo.getCurrentUserPosts.mockResolvedValue(postsInDB);
      } else {
        postRepo.getUserPosts.mockResolvedValue(postsInDB);
      }
      postService.handlePostFeatures.mockReturnValue(modifiedPost);
      //action
      const result = await service.getUserPosts(userid, query, currentUser);

      //assertions
      expect(result).toEqual(returnedPosts);
    });
  });
});
