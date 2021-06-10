import { Test, TestingModule } from '@nestjs/testing';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { OptionRepository } from './entities/option.repository';
import { OptionsGroupRepository } from './entities/optionsGroup.repository';
import { OptionsGroups } from './interfaces/optionsGroup.interface';
import { PostRepository } from './entities/post.repository';
import { PostsService } from './posts.service';
import { PostCreationDto } from './dto/postCreation.dto';
import { Post } from './entities/post.entity';
import { PostIdParam } from '../shared/validations/uuid.validator';
import { async } from 'rxjs';

describe('PostsService', () => {
  let service: PostsService;
  let optionRepo: OptionRepository;
  let groupRepo: OptionsGroupRepository;
  let postRepo: PostRepository;

  const mockedPosts = [
    {
      uuid: 'post5-uuid',
      created_at: '2021-06-01',
      caption: 'post 5',
      type: 'text poll',
      is_hidden: false,
      groups: [{ uuid: 'group1-uuid', options: [] }],
    },
  ];
  const mockedPost = {
    uuid: 'post6-uuid',
    caption: 'post 6',
    is_hidden: false,
    created_at: '2021-06-01',
    type: 'text poll',
    groups: [{ uuid: 'group1-uuid', options: [] }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: OptionsGroupRepository,
          useValue: {
            createGroup: jest.fn().mockResolvedValue({
              uuid: 'test group id',
            }),
          },
        },
        {
          provide: OptionRepository,
          useValue: {
            createOption: jest.fn().mockResolvedValue({
              uuid: 'test option id',
            }),
          },
        },
        {
          provide: PostRepository,
          useValue: {
            createPost: jest.fn().mockResolvedValue({ uuid: 'test id' }),
            getAllPosts: jest.fn().mockResolvedValue(mockedPosts),
            getSinglePost: jest.fn().mockResolvedValue(mockedPost),
            flagPostCreation: jest.fn(),
            deletePost: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    optionRepo = module.get<OptionRepository>(OptionRepository);
    groupRepo = module.get<OptionsGroupRepository>(OptionsGroupRepository);
    postRepo = module.get<PostRepository>(PostRepository);
  });

  it('should be defined & have the necessary methods', () => {
    expect(service).toBeDefined();
    expect(service).toHaveProperty('createPost');
    expect(service).toHaveProperty('createOptionGroup');
    expect(service).toHaveProperty('flagPost');
  });

  describe('createOptionGroup method', () => {
    it('should return the ids of the created groups & options', async () => {
      // data
      const postid = 'test post id';
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
            id: 'test group id',
            options: [
              {
                id: 'test option id',
              },
              {
                id: 'test option id',
              },
            ],
          },
        ],
      };
      const data = await service.createOptionGroup(postid, dto);

      // assertions
      expect(data).toEqual(createdOptionsGroups);
    });

    it('should call groupRepo.createGroup & optionRepo.createOption with correct parameters', async () => {
      // data
      const postid = 'test post id';
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
      const createdGroup = {
        uuid: 'test group id',
      };

      await service.createOptionGroup(postid, dto);

      // assertions
      expect(groupRepo.createGroup).toBeCalledWith(postid, dto.groups[0].name);
      expect(optionRepo.createOption).toBeCalledWith(
        createdGroup,
        dto.groups[0].options[0],
      );
    });

    it('should call groupRepo.createGroup & optionRepo.createOption methods equal to no of groups & options bassed in dto', async () => {
      // data
      const postid = 'test post id';
      const dto: OptionsGroupCreationDto = {
        groups: [
          {
            name: 'test group name',
            options: [
              { body: 'test option 1 body' },
              { body: 'test option 2 body' },
              { body: 'test option 2 body' },
            ],
          },
          {
            name: 'test group name',
            options: [
              { body: 'test option 1 body' },
              { body: 'test option 2 body' },
              { body: 'test option 2 body' },
            ],
          },
        ],
      };

      await service.createOptionGroup(postid, dto);

      // assertions
      expect(optionRepo.createOption).toHaveBeenCalledTimes(6);
      expect(groupRepo.createGroup).toHaveBeenCalledTimes(2);
    });
  });

  describe('createPost method', () => {
    it('should return object with id', async () => {
      const dto: PostCreationDto = {
        type: 'text_poll',
        caption: 'test caption',
        is_hidden: false,
      };
      const userId = 2;
      const data = await service.createPost(dto, userId);

      expect(data).toEqual({ id: 'test id' });

      expect(postRepo.createPost).toBeCalledWith(dto, userId);
      expect(postRepo.createPost).toBeCalledTimes(1);
    });
  });
  describe('getAllPosts function ', () => {
    it('should return an object with array of posts and postsCount', async () => {
      const result = await service.getAllPosts();
      const mockedReturnedPosts = [
        {
          id: 'post5-uuid',
          caption: 'post 5',
          is_hidden: false,
          created_at: '2021-06-01',
          type: 'text poll',
          options_groups: {
            groups: [{ id: 'group1-uuid', options: [] }],
          },
        },
      ];
      expect(result).toEqual({ postsCount: 1, posts: mockedReturnedPosts });
    });
  });

  describe('getSinglePosts function', () => {
    it('should return post object', async () => {
      const result = await service.getSinglePost('post6-uuid');
      const mockedReturnedPost = {
        id: 'post6-uuid',
        caption: 'post 6',
        is_hidden: false,
        created_at: '2021-06-01',
        type: 'text poll',
        options_groups: { groups: [{ id: 'group1-uuid', options: [] }] },
      };
      expect(result).toEqual(mockedReturnedPost);
      expect(postRepo.getSinglePost).toBeCalledWith('post6-uuid');
    });
  });

  describe('flagPost method', () => {
    it('should call postRepository.flagPost with dto & postid', async () => {
      const dto = { finished: true };
      const params = new PostIdParam();
      await service.flagPost(params, dto);
      expect(postRepo.flagPostCreation).toBeCalledWith(
        dto.finished,
        params.postid,
      );
    });
  });
  describe('deletePost', () => {
    it('should call repository fn with post uuid', async () => {
      const res = await service.deletePost('uuid');
      expect(res).toBeUndefined();
      expect(postRepo.deletePost).toHaveBeenCalledWith('uuid');
    });
  });
});
