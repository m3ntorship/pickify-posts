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

describe('Media Service', () => {
  let mediaService: MediaService;
  let postRepo: PostRepository;
  let mediaRepo: MediaRepository;
  let optionsGroupRepo: OptionsGroupRepository;
  let optionRepo: OptionRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        MediaRepository,
        OptionRepository,
        PostRepository,
        OptionsGroupRepository,
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
  });

  describe('handleMedia post entity', () => {
    it('Should try to find the needed post with necessary parameters', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.POST,
        file_id: 'test-media-file-uuid',
      };

      const foundPost = {
        uuid: 'test-post-uuid',
        unhandled_media: 3,
      } as Post;

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValue(foundPost);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.handleMedia(dto);

      // assertions
      expect(postRepo.getPostById).toBeCalledWith(dto.entity_id);
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
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(mediaService.handleMedia(dto)).rejects.toThrowError(
        new RpcException(`Post with id:${dto.entity_id} not found`),
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
        unhandled_media: 0,
      } as Post;

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValue(foundPost);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(mediaService.handleMedia(dto)).rejects.toThrowError(
        new RpcException(
          `post with id:${foundPost.uuid} does not have unhandled media files`,
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
        unhandled_media: 3,
      } as Post;

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValue(foundPost);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.handleMedia(dto);

      // assertions
      expect(mediaRepo.add).toBeCalledWith(
        foundPost,
        dto.file_id,
        dto.entity_type,
      );
    });

    it('Should handle post readiness by calling postRepo.handleReadiness with right parameters', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.POST,
        file_id: 'test-media-file-uuid',
      };

      const foundPost = {
        uuid: 'test-post-uuid',
        unhandled_media: 3,
      } as Post;

      // mocks
      postRepo.getPostById = jest.fn().mockResolvedValue(foundPost);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.handleMedia(dto);

      // assertions
      expect(postRepo.handleReadiness).toBeCalledWith(foundPost);
    });
  });

  describe('handleMedia optionsGroup entity', () => {
    it('Should try to find the needed group with necessary parameters', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION_GROUP,
        file_id: 'test-media-file-uuid',
      };

      const foundGroup = {
        uuid: 'test-group-uuid',
        post: {
          uuid: 'test-post-uuid',
          unhandled_media: 3,
        },
      } as OptiosnGroup;

      // mocks
      optionsGroupRepo.getByID = jest.fn().mockResolvedValue(foundGroup);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.getPostById = jest.fn().mockResolvedValue(foundGroup.post);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.handleMedia(dto);

      // assertions
      expect(optionsGroupRepo.getByID).toBeCalledWith(
        dto.entity_id,
        mediaType.POST,
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
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.getPostById = jest.fn().mockResolvedValue(undefined);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(mediaService.handleMedia(dto)).rejects.toThrowError(
        new RpcException(`options_group with id:${dto.entity_id} not found`),
      );
    });

    it('Should throw error if all media in a post is handled', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION_GROUP,
        file_id: 'test-media-file-uuid',
      };
      const foundGroup = {
        uuid: 'test-group-uuid',
        post: {
          uuid: 'test-post-uuid',
          unhandled_media: 0,
        },
      } as OptiosnGroup;

      // mocks
      optionsGroupRepo.getByID = jest.fn().mockResolvedValue(foundGroup);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.getPostById = jest.fn().mockResolvedValue(foundGroup.post);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(mediaService.handleMedia(dto)).rejects.toThrowError(
        new RpcException(
          `post with id:${foundGroup.post.uuid} does not have unhandled media files`,
        ),
      );
    });

    it('Should add media data to media database', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION_GROUP,
        file_id: 'test-media-file-uuid',
      };
      const foundGroup = {
        uuid: 'test-group-uuid',
        post: {
          uuid: 'test-post-uuid',
          unhandled_media: 3,
        },
      } as OptiosnGroup;

      // mocks
      optionsGroupRepo.getByID = jest.fn().mockResolvedValue(foundGroup);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.getPostById = jest.fn().mockResolvedValue(foundGroup.post);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.handleMedia(dto);

      // assertions
      expect(mediaRepo.add).toBeCalledWith(
        foundGroup,
        dto.file_id,
        dto.entity_type,
      );
    });

    it('Should handle post readiness by calling postRepo.handleReadiness with right parameters', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION_GROUP,
        file_id: 'test-media-file-uuid',
      };
      const foundGroup = {
        uuid: 'test-group-uuid',
        post: {
          uuid: 'test-post-uuid',
          unhandled_media: 3,
        },
      } as OptiosnGroup;

      // mocks
      optionsGroupRepo.getByID = jest.fn().mockResolvedValue(foundGroup);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.getPostById = jest.fn().mockResolvedValue(foundGroup.post);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.handleMedia(dto);

      // assertions
      expect(postRepo.handleReadiness).toBeCalledWith(foundGroup.post);
    });
  });

  describe('handleMedia option entity', () => {
    it('Should try to find the needed option with necessary parameters', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION,
        file_id: 'test-media-file-uuid',
      };

      const foundOption = {
        uuid: 'test-option-uuid',
        optionsGroup: {
          uuid: 'test-group-uuid',
          post: {
            uuid: 'test-post-uuid',
            unhandled_media: 3,
          },
        },
      } as Option;

      // mocks
      optionRepo.getByID = jest.fn().mockResolvedValue(foundOption);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.getPostById = jest
        .fn()
        .mockResolvedValue(foundOption.optionsGroup.post);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.handleMedia(dto);

      // assertions
      expect(optionRepo.getByID).toBeCalledWith(dto.entity_id, mediaType.POST);
    });

    it('Should throw error if option not found', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION,
        file_id: 'test-media-file-uuid',
      };

      // mocks
      optionRepo.getByID = jest.fn().mockResolvedValue(undefined);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.getPostById = jest.fn().mockResolvedValue(undefined);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(mediaService.handleMedia(dto)).rejects.toThrowError(
        new RpcException(`option with id:${dto.entity_id} not found`),
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
        uuid: 'test-option-uuid',
        optionsGroup: {
          uuid: 'test-group-uuid',
          post: {
            uuid: 'test-post-uuid',
            unhandled_media: 0,
          },
        },
      } as Option;

      // mocks
      optionRepo.getByID = jest.fn().mockResolvedValue(foundOption);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.getPostById = jest
        .fn()
        .mockResolvedValue(foundOption.optionsGroup.post);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // assertions
      expect(mediaService.handleMedia(dto)).rejects.toThrowError(
        new RpcException(
          `post with id:${foundOption.optionsGroup.post.uuid} does not have unhandled media files`,
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
        uuid: 'test-option-uuid',
        optionsGroup: {
          uuid: 'test-group-uuid',
          post: {
            uuid: 'test-post-uuid',
            unhandled_media: 3,
          },
        },
      } as Option;

      // mocks
      optionRepo.getByID = jest.fn().mockResolvedValue(foundOption);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.getPostById = jest
        .fn()
        .mockResolvedValue(foundOption.optionsGroup.post);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.handleMedia(dto);

      // assertions
      expect(mediaRepo.add).toBeCalledWith(
        foundOption,
        dto.file_id,
        dto.entity_type,
      );
    });

    it('Should handle post readiness by calling postRepo.handleReadiness with right parameters', async () => {
      // data
      const dto: MediaDataMessageDto = {
        entity_id: 'test-entity-uuid',
        entity_type: mediaType.OPTION,
        file_id: 'test-media-file-uuid',
      };
      const foundOption = {
        uuid: 'test-group-uuid',
        optionsGroup: {
          uuid: 'test-group-uuid',
          post: {
            uuid: 'test-post-uuid',
            unhandled_media: 3,
          },
        },
      } as Option;

      // mocks
      optionRepo.getByID = jest.fn().mockResolvedValue(foundOption);
      mediaRepo.add = jest.fn().mockResolvedValue(undefined);
      postRepo.getPostById = jest
        .fn()
        .mockResolvedValue(foundOption.optionsGroup.post);
      postRepo.handleReadiness = jest.fn().mockResolvedValue(undefined);

      // actions
      await mediaService.handleMedia(dto);

      // assertions
      expect(postRepo.handleReadiness).toBeCalledWith(
        foundOption.optionsGroup.post,
      );
    });
  });
});
