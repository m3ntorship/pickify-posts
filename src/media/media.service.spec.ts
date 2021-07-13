import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { mediaType } from '../shared/enums/mediaType.enum';
import { OptionRepository } from '../posts/entities/option.repository';
import { OptionsGroupRepository } from '../posts/entities/optionsGroup.repository';
import { PostRepository } from '../posts/entities/post.repository';
import { MediaDataMessageDto } from './dto/mediaDataMessage-dto';
import { MediaRepository } from './entities/media.repository';
import { MediaService } from './media.service';
import { Post } from '../posts/entities/post.entity';
import { OptiosnGroup } from '../posts/entities/optionsGroup.entity';
import { Option } from '../posts/entities/option.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('Media Service', () => {
  let mediaService: MediaService;
  let postRepo: PostRepository;
  let mediaRepo: MediaRepository;
  let optionsGroupRepo: OptionsGroupRepository;
  let optionRepo: OptionRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      // imports: [WinstonModule.forRoot(winstonLoggerOptions)],
      providers: [
        MediaService,
        MediaRepository,
        OptionRepository,
        PostRepository,
        OptionsGroupRepository,
        { provide: WINSTON_MODULE_PROVIDER, useValue: { info: jest.fn() } },
      ],
    }).compile();

    mediaService = moduleRef.get<MediaService>(MediaService);
    postRepo = moduleRef.get<PostRepository>(PostRepository);
    mediaRepo = moduleRef.get<MediaRepository>(MediaRepository);
    optionRepo = moduleRef.get<OptionRepository>(OptionRepository);
    optionsGroupRepo = moduleRef.get<OptionsGroupRepository>(
      OptionsGroupRepository,
    );
  });

  it('should be defined and have the necessary methods', async () => {
    expect(mediaService).toBeDefined();
    expect(mediaService).toHaveProperty('handleMedia');
    expect(mediaService).toHaveProperty('postMedia');
    expect(mediaService).toHaveProperty('option_groupMedia');
    expect(mediaService).toHaveProperty('optionMedia');
  });

  describe('handleMedia method', () => {
    it('Should call postMedia method if entity_type = post', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.POST,
        file_id: 'test-media-file-uuid',
      };

      // mocks
      mediaService.postMedia = jest.fn();

      // actions
      await mediaService.handleMedia(dto);

      // assertions
      expect(mediaService.postMedia).toBeCalledWith(dto);
    });

    it('Should call option_groupMedia method if entity_type = option_group', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION_GROUP,
        file_id: 'test-media-file-uuid',
      };

      // mocks
      mediaService.option_groupMedia = jest.fn();

      // actions
      await mediaService.handleMedia(dto);

      // assertions
      expect(mediaService.option_groupMedia).toBeCalledWith(dto);
    });

    it('Should call optionMedia method if entity_type = option_group', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION,
        file_id: 'test-media-file-uuid',
      };

      // mocks
      mediaService.optionMedia = jest.fn();

      // actions
      await mediaService.handleMedia(dto);

      // assertions
      expect(mediaService.optionMedia).toBeCalledWith(dto);
    });
  });

  describe('postMedia method', () => {
    it('Should try to find a post in DB using the passed entity_id', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.POST,
        file_id: 'test-media-file-uuid',
      };

      const foundPost = {
        uuid: '1',
        ready: false,
      } as Post;

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValue(foundPost);
      mediaRepo.addPostMedia = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.postMedia(dto);

      // assertions
      expect(mediaRepo.addPostMedia).toBeCalledWith(foundPost, dto.file_id);
    });
    it('Should throw error if post not found', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.POST,
        file_id: 'test-media-file-uuid',
      };

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValue(undefined);
      mediaRepo.addPostMedia = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(mediaService.postMedia(dto)).rejects.toThrowError(
        new RpcException(
          `rabbitMQ media message: Post with id:${dto.entity_id} not found`,
        ),
      );
    });

    it('Should throw error if all media in a post is handled', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.POST,
        file_id: 'test-media-file-uuid',
      };
      const foundPost = {
        uuid: 'test-post-uuid',
        ready: true,
      } as Post;

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValue(foundPost);
      mediaRepo.addPostMedia = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(mediaService.postMedia(dto)).rejects.toThrowError(
        new RpcException(
          `rabbitMQ media message: post with id:${foundPost.uuid} does not have unhandled media files`,
        ),
      );
    });

    it('Should add media data to media database', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.POST,
        file_id: 'test-media-file-uuid',
      };

      const foundPost = {
        uuid: 'test-post-uuid',
        ready: false,
      } as Post;

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValue(foundPost);
      mediaRepo.addPostMedia = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.postMedia(dto);

      // assertions
      expect(mediaRepo.addPostMedia).toBeCalledWith(foundPost, dto.file_id);
    });

    it('should return undefined', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.POST,
        file_id: 'test-media-file-uuid',
      };

      const foundPost = {
        uuid: 'test-post-uuid',
        ready: false,
      } as Post;

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValue(foundPost);
      mediaRepo.addPostMedia = jest.fn().mockResolvedValue(undefined);

      // action
      const res = await mediaService.postMedia(dto);

      // assertion
      expect(res).toBeUndefined();
    });
  });

  describe('option_groupMedia method', () => {
    it('Should try to find a group in DB using the passed entity_id', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION_GROUP,
        file_id: 'test-media-file-uuid',
      };

      const foundGroup = {
        post: {
          uuid: '1',
          ready: false,
        },
      } as OptiosnGroup;

      // mocks
      optionsGroupRepo.getByID = jest.fn().mockResolvedValue(foundGroup);
      mediaRepo.addOptionsGroupMedia = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.option_groupMedia(dto);

      // assertions
      expect(mediaRepo.addOptionsGroupMedia).toBeCalledWith(
        foundGroup,
        dto.file_id,
      );
    });
    it('Should throw error if group not found', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION_GROUP,
        file_id: 'test-media-file-uuid',
      };

      // mocks
      optionsGroupRepo.getByID = jest.fn().mockResolvedValue(undefined);
      mediaRepo.addOptionsGroupMedia = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(mediaService.option_groupMedia(dto)).rejects.toThrowError(
        new RpcException(
          `rabbitMQ media message: options_group with id:${dto.entity_id} not found`,
        ),
      );
    });

    it('Should throw error if all media in a post is handled', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.POST,
        file_id: 'test-media-file-uuid',
      };
      const foundGroup = {
        post: {
          uuid: '1',
          ready: true,
        },
      } as OptiosnGroup;

      // mocks
      optionsGroupRepo.getByID = jest.fn().mockResolvedValue(foundGroup);
      mediaRepo.addOptionsGroupMedia = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(mediaService.option_groupMedia(dto)).rejects.toThrowError(
        new RpcException(
          `rabbitMQ media message: post with id:${foundGroup.post.uuid} does not have unhandled media files`,
        ),
      );
    });

    it('Should add media data to media database', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.POST,
        file_id: 'test-media-file-uuid',
      };

      const foundGroup = {
        post: {
          uuid: '1',
          ready: false,
        },
      } as OptiosnGroup;

      // mocks
      optionsGroupRepo.getByID = jest.fn().mockResolvedValue(foundGroup);
      mediaRepo.addOptionsGroupMedia = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.option_groupMedia(dto);

      // assertions
      expect(mediaRepo.addOptionsGroupMedia).toBeCalledWith(
        foundGroup,
        dto.file_id,
      );
    });

    it('should return undefined', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.POST,
        file_id: 'test-media-file-uuid',
      };

      const foundGroup = {
        post: {
          uuid: '1',
          ready: false,
        },
      } as OptiosnGroup;

      // mocks
      optionsGroupRepo.getByID = jest.fn().mockResolvedValue(foundGroup);
      mediaRepo.addOptionsGroupMedia = jest.fn().mockResolvedValue(undefined);

      // action
      const res = await mediaService.option_groupMedia(dto);

      // assertion
      expect(res).toBeUndefined();
    });
  });

  describe('optionMedia method', () => {
    it('Should try to find an option in DB using the passed entity_id', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION,
        file_id: 'test-media-file-uuid',
      };

      const foundOption = {
        optionsGroup: {
          post: {
            uuid: '1',
            ready: false,
          },
        },
      } as Option;

      // mocks
      optionRepo.getByID = jest.fn().mockResolvedValue(foundOption);
      mediaRepo.addOptionMedia = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.optionMedia(dto);

      // assertions
      expect(mediaRepo.addOptionMedia).toBeCalledWith(foundOption, dto.file_id);
    });
    it('Should throw error if option not found', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION_GROUP,
        file_id: 'test-media-file-uuid',
      };

      // mocks
      optionRepo.getByID = jest.fn().mockResolvedValue(undefined);
      mediaRepo.addOptionMedia = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(mediaService.optionMedia(dto)).rejects.toThrowError(
        new RpcException(
          `rabbitMQ media message: option with id:${dto.entity_id} not found`,
        ),
      );
    });

    it('Should throw error if all media in a post is handled', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION,
        file_id: 'test-media-file-uuid',
      };
      const foundOption = {
        optionsGroup: {
          post: {
            uuid: '1',
            ready: true,
          },
        },
      } as Option;

      // mocks
      optionRepo.getByID = jest.fn().mockResolvedValue(foundOption);
      mediaRepo.addOptionMedia = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(mediaService.optionMedia(dto)).rejects.toThrowError(
        new RpcException(
          `rabbitMQ media message: post with id:${foundOption.optionsGroup.post.uuid} does not have unhandled media files`,
        ),
      );
    });

    it('Should add media data to media database', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION,
        file_id: 'test-media-file-uuid',
      };

      const foundOption = {
        optionsGroup: {
          post: {
            uuid: '1',
            ready: false,
          },
        },
      } as Option;

      // mocks
      optionRepo.getByID = jest.fn().mockResolvedValue(foundOption);
      mediaRepo.addOptionMedia = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.optionMedia(dto);

      // assertions
      expect(mediaRepo.addOptionMedia).toBeCalledWith(foundOption, dto.file_id);
    });

    it('should return undefined', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION,
        file_id: 'test-media-file-uuid',
      };

      const foundOption = {
        optionsGroup: {
          post: {
            uuid: '1',
            ready: false,
          },
        },
      } as Option;

      // mocks
      optionRepo.getByID = jest.fn().mockResolvedValue(foundOption);
      mediaRepo.addOptionMedia = jest.fn().mockResolvedValue(undefined);

      // action
      const res = await mediaService.optionMedia(dto);

      // assertion
      expect(res).toBeUndefined();
    });
  });
});
