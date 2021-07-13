import { Test, TestingModule } from '@nestjs/testing';
import { mediaType } from '../shared/enums/mediaType.enum';
import { OptionRepository } from '../posts/entities/option.repository';
import { OptionsGroupRepository } from '../posts/entities/optionsGroup.repository';
import { PostRepository } from '../posts/entities/post.repository';
import { MediaDataMessageDto } from './dto/mediaDataMessage-dto';
import { MediaRepository } from './entities/media.repository';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from '../logging/winston.options';

describe('Media controller', () => {
  let mediaService: MediaService;
  let mediaController: MediaController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [WinstonModule.forRoot(winstonLoggerOptions)],
      controllers: [MediaController],
      providers: [
        MediaService,
        MediaRepository,
        OptionRepository,
        PostRepository,
        OptionsGroupRepository,
      ],
    }).compile();

    mediaController = moduleRef.get<MediaController>(MediaController);
    mediaService = moduleRef.get<MediaService>(MediaService);
  });

  it('should be defined and have the necessary methods', async () => {
    expect(mediaController).toBeDefined();
    expect(mediaController).toHaveProperty('handleMedia');
  });

  describe('handleMedia method', () => {
    it('Should return undefined', async () => {
      // data
      const mediaData: MediaDataMessageDto = {
        entity_id: 'test-entity-id',
        entity_type: mediaType.OPTION,
        file_id: 'test-media-file-id',
      };

      // mocks
      mediaService.handleMedia = jest.fn().mockResolvedValueOnce(undefined);

      // actions
      const res = await mediaController.handleMedia(mediaData);

      // assertions
      expect(res).toBeUndefined();
    });

    it('Should call mediaService.handleMedia with necessary arguments', async () => {
      // data
      const mediaData: MediaDataMessageDto = {
        entity_id: 'test-entity-id',
        entity_type: mediaType.OPTION,
        file_id: 'test-media-file-id',
      };

      // mocks
      mediaService.handleMedia = jest.fn().mockResolvedValueOnce(undefined);

      // actions
      await mediaController.handleMedia(mediaData);

      // assertions
      expect(mediaService.handleMedia).toBeCalledWith(mediaData);
    });
  });
});
