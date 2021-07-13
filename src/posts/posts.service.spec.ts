import { Test, TestingModule } from '@nestjs/testing';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { OptionRepository } from './entities/option.repository';
import { OptionsGroupRepository } from './entities/optionsGroup.repository';
import { OptionsGroups } from './interfaces/optionsGroup.interface';
import { PostRepository } from './entities/post.repository';
import { PostsService } from './posts.service';
import { PostCreationDto } from './dto/postCreation.dto';
import {
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './entities/user.repository';
import { Post } from './interfaces/getPosts.interface';
import { getNow } from '../shared/utils/datetime';

describe('PostsService', () => {
  let service: PostsService;
  let optionRepo: OptionRepository;
  let groupRepo: OptionsGroupRepository;
  let postRepo: PostRepository;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        OptionsGroupRepository,
        OptionRepository,
        PostRepository,
        UserRepository,
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    optionRepo = module.get<OptionRepository>(OptionRepository);
    groupRepo = module.get<OptionsGroupRepository>(OptionsGroupRepository);
    postRepo = module.get<PostRepository>(PostRepository);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined & have the necessary methods', () => {
    expect(service).toBeDefined();
    expect(service).toHaveProperty('createPost');
    expect(service).toHaveProperty('createOptionGroup');
    expect(service).toHaveProperty('flagPost');
    expect(service).toHaveProperty('deletePost');
    expect(service).toHaveProperty('getAllPosts');
    expect(service).toHaveProperty('getSinglePost');
  });

  describe('createOptionGroup method', () => {
    it('should return the ids of the created groups & options', async () => {
      // data
      const postId = 'test post id';
      const userId = 'test-user-uuid';
      const foundPost = { id: 1, user: { uuid: userId } };
      const dto: OptionsGroupCreationDto = {
        groups: [
          {
            name: 'test group name',
            options: [
              { body: 'test option 1 body' },
              { body: 'test option 2 body' },
            ],
          },
        ],
      };
      const createdOptionsGroups: OptionsGroups = {
        groups: [
          {
            id: 'created-group-uuid',
            options: [
              {
                id: 'created-option-uuid',
              },
              {
                id: 'created-option-uuid',
              },
            ],
          },
        ],
      };

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(foundPost);
      groupRepo.createGroup = jest
        .fn()
        .mockResolvedValue({ uuid: 'created-group-uuid' });
      optionRepo.createBulk = jest
        .fn()
        .mockResolvedValue([
          { uuid: 'created-option-uuid' },
          { uuid: 'created-option-uuid' },
        ]);

      // action
      const data = await service.createOptionGroup(postId, dto, userId);

      // assertions
      expect(data).toEqual(createdOptionsGroups);
    });

    it('should throw error if post not found', async () => {
      // data
      const postId = 'test post id';
      const userId = '3';
      const dto: OptionsGroupCreationDto = {
        groups: [
          {
            name: 'test group name',
            options: [
              { body: 'test option 1 body' },
              { body: 'test option 2 body' },
            ],
          },
        ],
      };

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(undefined);
      groupRepo.createGroup = jest
        .fn()
        .mockResolvedValue({ uuid: 'created-group-uuid' });
      optionRepo.createBulk = jest
        .fn()
        .mockResolvedValue([
          { uuid: 'created-option-uuid' },
          { uuid: 'created-option-uuid' },
        ]);

      // action
      const data = service.createOptionGroup(postId, dto, userId);

      // assertions
      expect(data).rejects.toThrowError(
        new NotFoundException('Post with id: test post id not found'),
      );
    });

    it('should throw error if user is not post owner', async () => {
      // data
      const postId = 'test post id';
      const userId = 'user-owns-post';
      const foundPost = { id: 1, user: { uuid: 'user-dont-own-post' } };
      const dto: OptionsGroupCreationDto = {
        groups: [
          {
            name: 'test group name',
            options: [
              { body: 'test option 1 body' },
              { body: 'test option 2 body' },
            ],
          },
        ],
      };

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(foundPost);
      groupRepo.createGroup = jest
        .fn()
        .mockResolvedValue({ uuid: 'created-group-uuid' });
      optionRepo.createBulk = jest
        .fn()
        .mockResolvedValue([
          { uuid: 'created-option-uuid' },
          { uuid: 'created-option-uuid' },
        ]);

      // action
      const data = service.createOptionGroup(postId, dto, userId);

      // assertions
      expect(data).rejects.toThrowError(
        new UnauthorizedException('Unauthorized'),
      );
    });
  });

  describe('createPost method', () => {
    it('should return the uuid of the created post in object with id prop', () => {
      // data
      const dto: PostCreationDto = {
        type: 'text_poll',
        caption: 'test caption',
        is_hidden: false,
        media_count: 3,
      };
      const userId = 'test-user-uuid';

      const user = {
        uuid: 'test-user-uuid',
        name: 'test-name',
        profile_pic: 'test-picture-url',
      };

      // mocks
      postRepo.createPost = jest
        .fn()
        .mockResolvedValueOnce({ uuid: 'created-post-uuid' });

      userRepo.findOne = jest.fn().mockResolvedValue(user);

      // action
      const data = service.createPost(dto, userId);

      // assertions
      expect(data).resolves.toEqual({ id: 'created-post-uuid' });
    });

    it('should call userRepo.findOne with the appropriate parameters', async () => {
      // data
      const dto: PostCreationDto = {
        type: 'text_poll',
        caption: 'test caption',
        is_hidden: false,
        media_count: 3,
      };
      const userId = 'test-user-uuid';

      const user = {
        uuid: 'test-user-uuid',
        name: 'test-name',
        profile_pic: 'test-picture-url',
      };

      // mocks
      postRepo.createPost = jest
        .fn()
        .mockResolvedValueOnce({ uuid: 'created-post-uuid' });

      userRepo.findOne = jest.fn().mockResolvedValue(user);

      // action
      await service.createPost(dto, userId);

      // assertions
      expect(userRepo.findOne).toBeCalledWith({ where: { uuid: userId } });
      expect(userRepo.findOne).toBeCalledTimes(1);
    });

    it('should thorw error if user not found', async () => {
      // data
      const dto: PostCreationDto = {
        type: 'text_poll',
        caption: 'test caption',
        is_hidden: false,
        media_count: 3,
      };
      const userId = 'test-user-uuid';

      // mocks
      postRepo.createPost = jest
        .fn()
        .mockResolvedValueOnce({ uuid: 'created-post-uuid' });

      userRepo.findOne = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(service.createPost(dto, userId)).rejects.toThrowError(
        new NotFoundException(`User with id: ${userId} not found`),
      );
    });

    it('should call postRepo.createPost with the appropriate parameters', async () => {
      // data
      const dto: PostCreationDto = {
        type: 'text_poll',
        caption: 'test caption',
        is_hidden: false,
        media_count: 3,
      };
      const userId = 'test-user-uuid';

      const user = {
        uuid: 'test-user-uuid',
        name: 'test-name',
        profile_pic: 'test-picture-url',
      };

      // mocks
      postRepo.createPost = jest
        .fn()
        .mockResolvedValueOnce({ uuid: 'created-post-uuid' });

      userRepo.findOne = jest.fn().mockResolvedValue(user);

      // action
      await service.createPost(dto, userId);

      // assertions
      expect(postRepo.createPost).toBeCalledWith(dto, user);
      expect(postRepo.createPost).toBeCalledTimes(1);
    });
  });

  describe('getAllPosts function ', () => {
    it('should return object contains postsCount and array of posts', async () => {
      // data
      const userId = 'user1';
      const postInDB = {
        uuid: 'test-post-uuid',
        ready: true,
        caption: 'test-post-caption',
        is_hidden: false,
        created_at: getNow().toDate(),
        type: 'text poll',
        user: {
          uuid: userId,
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
      const postsInDB = [postInDB, postInDB];
      const expectedPost: Post = {
        id: postInDB.uuid,
        caption: postInDB.caption,
        is_hidden: postInDB.is_hidden,
        created_at: postInDB.created_at,
        type: postInDB.type,
        user: {
          id: postInDB.user.uuid,
          name: postInDB.user.name,
          profile_pic: postInDB.user.profile_pic,
        },
        media: postInDB.media,
        options_groups: {
          groups: [
            {
              id: postInDB.groups[0].uuid,
              name: postInDB.groups[0].name,
              options: [
                {
                  id: postInDB.groups[0].options[0].uuid,
                  body: postInDB.groups[0].options[0].body,
                  vote_count: postInDB.groups[0].options[0].vote_count,
                  voted: postInDB.groups[0].options[0].voted,
                },
              ],
            },
          ],
        },
      };
      const expectedPosts = {
        postsCount: postsInDB.length,
        posts: [expectedPost, expectedPost],
      };

      // mocks
      postRepo.getAllPosts = jest.fn().mockResolvedValueOnce(postsInDB);

      // actions
      const result = await service.getAllPosts(userId);

      // assertions
      expect(result).toEqual(expectedPosts);
    });

    it('should return only the posts with ready = true', async () => {
      // data
      const userId = 'user1';
      const postInDB = {
        uuid: 'test-post-uuid',
        ready: false,
        caption: 'test-post-caption',
        is_hidden: false,
        created_at: getNow().toDate(),
        type: 'text poll',
        user: {
          uuid: userId,
          name: 'test',
          profile_pic: 'test-url',
        },
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
      const postsInDB = [
        {
          ...postInDB,
          ready: true,
          groups: [
            {
              ...postInDB.groups[0],
              options: [{ ...postInDB.groups[0].options[0] }],
            },
          ],
        },
        {
          ...postInDB,
          groups: [
            {
              ...postInDB.groups[0],
              options: [{ ...postInDB.groups[0].options[0] }],
            },
          ],
        },
      ];
      const expectedPost = {
        id: postInDB.uuid,
        caption: postInDB.caption,
        is_hidden: postInDB.is_hidden,
        created_at: postInDB.created_at,
        type: postInDB.type,
        user: {
          id: postInDB.user.uuid,
          name: postInDB.user.name,
          profile_pic: postInDB.user.profile_pic,
        },
        options_groups: {
          groups: [
            {
              id: postInDB.groups[0].uuid,
              name: postInDB.groups[0].name,
              options: [
                {
                  id: postInDB.groups[0].options[0].uuid,
                  body: postInDB.groups[0].options[0].body,
                  vote_count: postInDB.groups[0].options[0].vote_count,
                  voted: postInDB.groups[0].options[0].voted,
                },
              ],
            },
          ],
        },
      };
      const expectedPosts = {
        postsCount: 1,
        posts: [{ ...expectedPost }],
      };

      // mocks
      postRepo.getAllPosts = jest
        .fn()
        .mockResolvedValueOnce(postsInDB.filter((post) => post.ready));

      // actions
      const result = await service.getAllPosts(userId);

      // assertions
      expect(result).toEqual(expectedPosts);
    });
  });

  describe('getSinglePost function', () => {
    it('Should return post with vote_count for all options if user is post owner', async () => {
      // data
      const userId = 'test-post-owner-uuid';
      const postInDB = {
        uuid: 'test-post-uuid',
        ready: true,
        caption: 'test-post-caption',
        is_hidden: false,
        created_at: getNow().toDate(),
        type: 'text poll',
        user: {
          uuid: userId,
          name: 'test',
          profile_pic: 'test-url',
        },
        media: [{ url: 'test-media-url' }],
        groups: [
          {
            uuid: 'test-group-uuid',
            name: 'test-group-name',
            media: [],
            options: [
              {
                vote_count: 2,
                body: 'test-option-body',
                uuid: 'test-option32-uuid',
                voted: false,
                votes: [
                  {
                    uuid: 'vote12-test-uuid',
                    user: { uuid: 'user15-test-uuid' },
                  },
                  {
                    uuid: 'vote44-test-uuid',
                    user: { uuid: 'user12-test-uuid' },
                  },
                ],
              },
              {
                vote_count: 1,
                body: 'test-option-body',
                uuid: 'test-option22-uuid',
                voted: false,
                votes: [
                  {
                    uuid: 'vote11-test-uuid',
                    user: { uuid: 'user34-test-uuid' },
                  },
                ],
              },
            ],
          },
        ],
      };
      const expectedPost = {
        id: postInDB.uuid,
        caption: postInDB.caption,
        is_hidden: postInDB.is_hidden,
        created_at: postInDB.created_at,
        type: postInDB.type,
        media: postInDB.media,
        user: {
          id: postInDB.user.uuid,
          name: postInDB.user.name,
          profile_pic: postInDB.user.profile_pic,
        },
        options_groups: {
          groups: [
            {
              id: postInDB.groups[0].uuid,
              name: postInDB.groups[0].name,
              media: postInDB.groups[0].media,
              options: [
                {
                  vote_count: postInDB.groups[0].options[0].vote_count,
                  id: postInDB.groups[0].options[0].uuid,
                  body: postInDB.groups[0].options[0].body,
                  voted: postInDB.groups[0].options[0].voted,
                },
                {
                  vote_count: postInDB.groups[0].options[1].vote_count,
                  id: postInDB.groups[0].options[1].uuid,
                  body: postInDB.groups[0].options[1].body,
                  voted: postInDB.groups[0].options[1].voted,
                },
              ],
            },
          ],
        },
      };
      const postId = 'test-post-uuid';

      // mocks
      postRepo.getDetailedPostById = jest.fn().mockResolvedValueOnce(postInDB);

      // actions
      const result = await service.getSinglePost(postId, userId);

      // assertions
      expect(result).toEqual(expectedPost);
    });

    it('Should return same media found in DB', async () => {
      // data
      const userId = 'test-post-owner-uuid';
      const postInDB = {
        uuid: 'test-post-uuid',
        ready: true,
        caption: 'test-post-caption',
        is_hidden: false,
        created_at: getNow().toDate(),
        type: 'text poll',
        user: {
          uuid: userId,
          name: 'test',
          profile_pic: 'test-url',
        },
        media: [{ url: 'test-media-url' }],
        groups: [
          {
            uuid: 'test-group-uuid',
            name: 'test-group-name',
            media: [],
            options: [
              {
                vote_count: 2,
                body: 'test-option-body',
                uuid: 'test-option32-uuid',
                voted: false,
                votes: [
                  {
                    uuid: 'vote12-test-uuid',
                    user: { uuid: 'user15-test-uuid' },
                  },
                  {
                    uuid: 'vote44-test-uuid',
                    user: { uuid: 'user12-test-uuid' },
                  },
                ],
              },
              {
                vote_count: 1,
                body: 'test-option-body',
                uuid: 'test-option22-uuid',
                voted: false,
                votes: [
                  {
                    uuid: 'vote11-test-uuid',
                    user: { uuid: 'user34-test-uuid' },
                  },
                ],
              },
            ],
          },
        ],
      };
      const expectedPost = {
        id: postInDB.uuid,
        caption: postInDB.caption,
        is_hidden: postInDB.is_hidden,
        created_at: postInDB.created_at,
        type: postInDB.type,
        media: [{ url: 'test-media-url' }],
        user: {
          id: postInDB.user.uuid,
          name: postInDB.user.name,
          profile_pic: postInDB.user.profile_pic,
        },
        options_groups: {
          groups: [
            {
              id: postInDB.groups[0].uuid,
              name: postInDB.groups[0].name,
              media: postInDB.groups[0].media,
              options: [
                {
                  vote_count: postInDB.groups[0].options[0].vote_count,
                  id: postInDB.groups[0].options[0].uuid,
                  body: postInDB.groups[0].options[0].body,
                  voted: postInDB.groups[0].options[0].voted,
                },
                {
                  vote_count: postInDB.groups[0].options[1].vote_count,
                  id: postInDB.groups[0].options[1].uuid,
                  body: postInDB.groups[0].options[1].body,
                  voted: postInDB.groups[0].options[1].voted,
                },
              ],
            },
          ],
        },
      };
      const postId = 'test-post-uuid';

      // mocks
      postRepo.getDetailedPostById = jest.fn().mockResolvedValueOnce(postInDB);

      // actions
      const result = await service.getSinglePost(postId, userId);

      // assertions
      expect(result).toEqual(expectedPost);
    });

    it('Should return post without vote_count for any option in the group if user has not voted in that group', async () => {
      // data
      const userId = 'user1';
      const postInDB = {
        uuid: 'test-post-uuid',
        ready: true,
        caption: 'test-post-caption',
        is_hidden: false,
        created_at: 'test-creation-time',
        type: 'text poll',
        media: [],
        user: {
          uuid: 'user2',
          name: 'test',
          profile_pic: 'test-url',
        },
        groups: [
          {
            uuid: 'test-group-uuid',
            name: 'test-group-name',
            media: [],
            options: [
              {
                vote_count: 2,
                body: 'test-option-body',
                uuid: 'test-option32-uuid',
                votes: [
                  {
                    uuid: 'vote12-test-uuid',
                    user: { uuid: 'user3' },
                  },
                  {
                    uuid: 'vote44-test-uuid',
                    user: { uuid: 'user4' },
                  },
                ],
              },
              {
                vote_count: 1,
                body: 'test-option-body',
                uuid: 'test-option22-uuid',
                votes: [
                  {
                    uuid: 'vote11-test-uuid',
                    user: { uuid: 'user5' },
                  },
                ],
              },
            ],
          },
        ],
      };
      const expectedPost = {
        id: postInDB.uuid,
        caption: postInDB.caption,
        is_hidden: postInDB.is_hidden,
        created_at: postInDB.created_at,
        type: postInDB.type,
        user: {
          id: postInDB.user.uuid,
          name: postInDB.user.name,
          profile_pic: postInDB.user.profile_pic,
        },
        media: postInDB.media,
        options_groups: {
          groups: [
            {
              id: postInDB.groups[0].uuid,
              name: postInDB.groups[0].name,
              media: postInDB.groups[0].media,
              options: [
                {
                  id: postInDB.groups[0].options[0].uuid,
                  body: postInDB.groups[0].options[0].body,
                },
                {
                  id: postInDB.groups[0].options[1].uuid,
                  body: postInDB.groups[0].options[1].body,
                },
              ],
            },
          ],
        },
      };
      const postId = 'test-post-uuid';

      // mocks
      postRepo.getDetailedPostById = jest.fn().mockResolvedValueOnce(postInDB);

      // actions
      const result = await service.getSinglePost(postId, userId);

      // assertions
      expect(result).toEqual(expectedPost);
    });

    it('Should return post with vote_count for all options ONLY in the group user voted in', async () => {
      // data
      const userId = 'user1';
      const postInDB = {
        uuid: 'test-post-uuid',
        ready: true,
        caption: 'test-post-caption',
        is_hidden: false,
        created_at: 'test-creation-time',
        type: 'text poll',
        user: {
          uuid: 'user2',
          name: 'test',
          profile_pic: 'test-url',
        },
        groups: [
          // group 1
          {
            uuid: 'test-group-uuid',
            name: 'test-group-name',
            options: [
              // option 1 in group 1
              {
                vote_count: 2,
                body: 'test-option-body',
                uuid: 'test-option32-uuid',
                votes: [
                  {
                    uuid: 'vote12-test-uuid',
                    user: { uuid: 'user3' },
                  },
                  {
                    uuid: 'vote44-test-uuid',
                    user: { uuid: 'user4' },
                  },
                ],
              },
              // option 2 in group 1
              {
                vote_count: 1,
                body: 'test-option-body',
                uuid: 'test-option22-uuid',
                votes: [
                  {
                    uuid: 'vote11-test-uuid',
                    user: { uuid: 'user1' },
                  },
                ],
              },
            ],
          },
          // group 2
          {
            uuid: 'test-group-uuid',
            name: 'test-group-name',
            options: [
              // option 1 in group 2
              {
                vote_count: 2,
                body: 'test-option-body',
                uuid: 'test-option32-uuid',
                votes: [
                  {
                    uuid: 'vote12-test-uuid',
                    user: { uuid: 'user7' },
                  },
                  {
                    uuid: 'vote44-test-uuid',
                    user: { uuid: 'user3' },
                  },
                ],
              },
            ],
          },
        ],
      };
      const expectedPost = {
        id: postInDB.uuid,
        caption: postInDB.caption,
        is_hidden: postInDB.is_hidden,
        created_at: postInDB.created_at,
        type: postInDB.type,
        user: {
          id: postInDB.user.uuid,
          name: postInDB.user.name,
          profile_pic: postInDB.user.profile_pic,
        },
        options_groups: {
          groups: [
            // group 1
            {
              id: postInDB.groups[0].uuid,
              name: postInDB.groups[0].name,
              options: [
                {
                  vote_count: postInDB.groups[0].options[0].vote_count,
                  voted: false,
                  id: postInDB.groups[0].options[0].uuid,
                  body: postInDB.groups[0].options[0].body,
                },
                {
                  vote_count: postInDB.groups[0].options[1].vote_count,
                  id: postInDB.groups[0].options[1].uuid,
                  body: postInDB.groups[0].options[1].body,
                  voted: true,
                },
              ],
            },
            // group 2
            {
              id: postInDB.groups[1].uuid,
              name: postInDB.groups[1].name,
              options: [
                {
                  id: postInDB.groups[1].options[0].uuid,
                  body: postInDB.groups[1].options[0].body,
                },
              ],
            },
          ],
        },
      };
      const postId = 'test-post-uuid';

      // mocks
      postRepo.getDetailedPostById = jest.fn().mockResolvedValueOnce(postInDB);

      // actions
      const result = await service.getSinglePost(postId, userId);

      // assertions
      expect(result).toEqual(expectedPost);
    });

    it('Should return post without user details if he is not post owner and is_hidden=true', async () => {
      // data
      const userId = 'user1';
      const postInDB = {
        uuid: 'test-post-uuid',
        ready: true,
        caption: 'test-post-caption',
        is_hidden: true,
        created_at: 'test-creation-time',
        type: 'text poll',
        user: {
          uuid: 'user2',
          name: 'test',
          profile_pic: 'test-url',
        },
        groups: [
          {
            uuid: 'test-group-uuid',
            name: 'test-group-name',
            options: [
              {
                vote_count: 0,
                body: 'test-option-body',
                uuid: 'test-option32-uuid',
              },
              {
                vote_count: 0,
                body: 'test-option-body',
                uuid: 'test-option22-uuid',
              },
            ],
          },
        ],
      };
      const expectedPost = {
        id: postInDB.uuid,
        caption: postInDB.caption,
        is_hidden: postInDB.is_hidden,
        created_at: postInDB.created_at,
        type: postInDB.type,
        options_groups: {
          groups: [
            {
              id: postInDB.groups[0].uuid,
              name: postInDB.groups[0].name,
              options: [
                {
                  id: postInDB.groups[0].options[0].uuid,
                  body: postInDB.groups[0].options[0].body,
                },
                {
                  id: postInDB.groups[0].options[1].uuid,
                  body: postInDB.groups[0].options[1].body,
                },
              ],
            },
          ],
        },
      };
      const postId = 'test-post-uuid';

      // mocks
      postRepo.getDetailedPostById = jest.fn().mockResolvedValueOnce(postInDB);

      // actions
      const result = await service.getSinglePost(postId, userId);

      // assertions
      expect(result).toEqual(expectedPost);
    });

    it('should throw error if post not found', () => {
      // data
      const userId = 'test-user-uuid';
      const postId = 'test-post-uuid';

      // mocks
      postRepo.getDetailedPostById = jest.fn().mockResolvedValueOnce(undefined);

      // actions
      const result = service.getSinglePost(postId, userId);

      // assertions
      expect(result).rejects.toThrowError(
        new NotFoundException(`Post with id: ${postId} not found`),
      );
    });

    it('should throw error if post not ready yet', () => {
      // data
      const userId = 'test-user-uuid';
      const postInDB = {
        uuid: 'test-post-uuid',
        ready: false,
        caption: 'test-post-caption',
        is_hidden: false,
        created_at: getNow().toDate(),
        type: 'text poll',
        groups: [
          {
            uuid: 'test-group-uuid',
            name: 'test-group-name',
            options: [
              {
                vote_count: 2,
                body: 'test-option-body',
                uuid: 'test-option-uuid',
              },
            ],
          },
        ],
      };
      const postId = 'test-post-uuid';

      // mocks
      postRepo.getDetailedPostById = jest.fn().mockResolvedValueOnce(postInDB);

      // actions
      const result = service.getSinglePost(postId, userId);

      // assertions
      expect(result).rejects.toThrowError(
        new HttpException(
          `Post with id: ${postId} still under creation...`,
          423,
        ),
      );
    });
  });

  describe('flagPost method', () => {
    it('should return undefined', () => {
      // data
      const flag = true;
      const postid = 'test-post-uuid';
      const userId = 'test-user-uuid';
      const foundPost = { id: 1, user: { uuid: userId } };

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(foundPost);

      postRepo.flagPostCreation = jest.fn().mockResolvedValueOnce(undefined);

      // action
      const data = service.flagPost(postid, flag, userId);

      // assertions
      expect(data).resolves.toBeUndefined();
    });

    it('should have getPostById method that is called with post id', async () => {
      // data
      const flag = true;
      const postid = 'test-post-uuid';
      const userId = 'test-user-uuid';
      const foundPost = { id: 1, user: { uuid: userId } };

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(foundPost);

      postRepo.flagPostCreation = jest.fn().mockResolvedValueOnce(undefined);

      // action
      await service.flagPost(postid, flag, userId);

      // assertions
      expect(postRepo.getPostById).toBeCalledWith(postid);
    });

    it('should throw error if post is not found', () => {
      // data
      const flag = true;
      const postid = 'test-post-uuid';
      const userId = '3';

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(undefined);

      postRepo.flagPostCreation = jest.fn().mockResolvedValueOnce(undefined);

      // action
      const data = service.flagPost(postid, flag, userId);

      // assertions
      expect(data).rejects.toThrowError(
        new NotFoundException('Post with id: test-post-uuid not found'),
      );
    });

    it('should throw error if user is not post owner', () => {
      // data
      const flag = true;
      const postid = 'test-post-uuid';
      const userId = 'user-owns-post';
      const foundPost = { id: 1, user: { uuid: 'user-dont-own-post' } };

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(foundPost);

      postRepo.flagPostCreation = jest.fn().mockResolvedValueOnce(undefined);

      // action
      const data = service.flagPost(postid, flag, userId);

      // assertions
      expect(data).rejects.toThrowError(
        new UnauthorizedException('Unauthorized'),
      );
    });

    it('should have flagPostCreation method that is called with finished flag and the found post', async () => {
      // data
      const flag = true;
      const postid = 'test-post-uuid';
      const userId = 'test-user-uuid';
      const foundPost = { id: 1, user: { uuid: userId } };

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(foundPost);

      postRepo.flagPostCreation = jest.fn().mockResolvedValueOnce(undefined);

      // action
      await service.flagPost(postid, flag, userId);

      // assertions
      expect(postRepo.flagPostCreation).toBeCalledWith(flag, foundPost);
    });
  });
  describe('deletePost', () => {
    it('should return undefined', () => {
      // data
      const userId = 'test-user-id';
      const postId = 'test-post-id';
      const foundPost = { id: 1, user: { uuid: userId } };

      //mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(foundPost);
      postRepo.remove = jest.fn().mockResolvedValueOnce(undefined);

      // action
      const res = service.deletePost(postId, userId);

      // assertions
      expect(res).resolves.toBeUndefined();
    });

    it('should have getPostById method that is called with post id', async () => {
      // data
      const userId = 'test-user-id';
      const postId = 'test-post-id';
      const foundPost = { id: 1, user: { uuid: userId } };

      //mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(foundPost);
      postRepo.remove = jest.fn().mockResolvedValueOnce(undefined);

      // action
      await service.deletePost(postId, userId);

      // assertions
      expect(postRepo.getPostById).toBeCalledWith(postId);
    });

    it('should throw error if post is not found', () => {
      // data
      const userId = '2';
      const postId = 'test-post-uuid';

      //mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(undefined);
      postRepo.remove = jest.fn().mockResolvedValueOnce(undefined);

      // action
      const res = service.deletePost(postId, userId);

      // assertions
      expect(res).rejects.toThrowError(
        new NotFoundException('Post with id: test-post-uuid not found'),
      );
    });

    it('should throw error if user is not owner of post', () => {
      // data
      const userId = 'user-owns-post';
      const postId = 'test-post-uuid';
      const foundPost = { id: 1, user: { uuid: 'user-dont-own-post' } };

      //mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(foundPost);
      postRepo.remove = jest.fn().mockResolvedValueOnce(undefined);

      // action
      const res = service.deletePost(postId, userId);

      // assertions
      expect(res).rejects.toThrowError(
        new UnauthorizedException('Unauthorized'),
      );
    });

    it('should call postRepository.remove with the found post', async () => {
      // data
      const userId = 'test-user-uuid';
      const postId = 'test-post-uuid';
      const foundPost = { id: 1, user: { uuid: userId } };

      //mocks
      postRepo.getPostById = jest.fn().mockResolvedValueOnce(foundPost);
      postRepo.remove = jest.fn().mockResolvedValueOnce(undefined);

      // action
      await service.deletePost(postId, userId);

      // assertions
      expect(postRepo.remove).toBeCalledWith(foundPost);
    });
  });
});
