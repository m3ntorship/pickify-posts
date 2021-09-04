import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts/posts.service';
import { PostRepository } from '../posts/entities/post.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './entities/user.repository';
import { OptionsGroupRepository } from '../posts/entities/optionsGroup.repository';
import { OptionRepository } from '../posts/entities/option.repository';
import { UserIdParam } from '../shared/validations/uuid.validator';
import { QueryParameters } from '../shared/validations/query.validator';
import { Post } from '../posts/interfaces/getPosts.interface';
import { getNow } from '../shared/utils/datetime';

describe('UsersController', () => {
  let controller: UsersController;
  const userService = {
    getUserPosts: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: userService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller).toHaveProperty('createUser');
    expect(controller).toHaveProperty('getPosts');
  });

  describe('createUser Method', () => {
    it('should return user from request body', () => {
      // data
      const req = {
        user: 'test',
      };
      // actions
      const res = controller.createUser(req);
      // assertion
      expect(res).toEqual(req.user);
    });
  });

  describe('getPosts function', () => {
    it('should return object of postscount and array of posts', async () => {
      //data
      const param = { userId: 'user-uuid' } as UserIdParam;
      const query = { limit: 10, offset: 0 } as QueryParameters;
      const req: any = { user: { uuid: 'user-uuid' } };
      const returnedUser = {
        id: 'user-id',
        name: 'user-name',
        profile_pic: 'user-pic',
      };
      const post = {
        uuid: 'test-post-uuid',
        ready: true,
        caption: 'test-post-caption',
        is_hidden: false,
        created_at: getNow().toDate(),
        type: 'text poll',
        user: {
          uuid: param.userId,
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
        user: returnedUser,
        postsCount: postsInDB.length,
        posts: [modifiedPost],
      };

      //mocks
      userService.getUserPosts.mockResolvedValue(returnedPosts);
      //actions
      const result = await controller.getPosts(param, query, req);
      //assertions
      expect(result).toEqual(returnedPosts);
    });
  });
});
