import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OptionRepository } from '../posts/entities/option.repository';
import { OptionsGroupRepository } from '../posts/entities/optionsGroup.repository';
import { PostRepository } from '../posts/entities/post.repository';
import { MediaDataMessageDto } from './dto/mediaDataMessage-dto';
import { MediaRepository } from './entities/media.repository';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { getNow } from '../shared/utils/datetime';

@Injectable()
export class MediaService {
  constructor(
    private mediaRepo: MediaRepository,
    private postRepo: PostRepository,
    private optionRepo: OptionRepository,
    private optionsGroupRepo: OptionsGroupRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private async postMedia(mediaData: MediaDataMessageDto): Promise<void> {
    const post = await this.postRepo.getPostById(mediaData.entity_id);

    if (!post) {
      throw new RpcException(`Post with id:${mediaData.entity_id} not found`);
    }

    // if all media files got handled before
    if (post.ready) {
      throw new RpcException(
        `post with id:${post.uuid} does not have unhandled media files`,
      );
    }

    // add the data to media table in DB
    await this.mediaRepo.add(post, mediaData.file_id, mediaData.entity_type);

    // log message
    this.logger.info(
      'rabbitMQ media message processing: after adding media to DB and before handling readiness',
      {
        data: mediaData,
        timestamp: getNow(),
      },
    );
  }

  private async option_groupMedia(
    mediaData: MediaDataMessageDto,
  ): Promise<void> {
    // get the optionsGroup with relation to post
    const optionsGroup = await this.optionsGroupRepo.getByID(
      mediaData.entity_id,
      'post',
    );

    // if optionsGroup is not found
    if (!optionsGroup) {
      throw new RpcException(
        `options_group with id:${mediaData.entity_id} not found`,
      );
    }

    // if all media files got handled before
    if (optionsGroup.post.ready) {
      throw new RpcException(
        `post with id:${optionsGroup.post.uuid} does not have unhandled media files`,
      );
    }

    // add the data to media table in DB
    await this.mediaRepo.add(
      optionsGroup,
      mediaData.file_id,
      mediaData.entity_type,
    );

    // log message
    this.logger.info(
      'rabbitMQ media message processing: after adding media to DB and before handling readiness',
      {
        data: mediaData,
        timestamp: getNow(),
      },
    );
  }

  private async optionMedia(mediaData: MediaDataMessageDto): Promise<void> {
    // get the option with relation to post
    const option = await this.optionRepo.getByID(mediaData.entity_id, 'post');
    // if option is not found
    if (!option) {
      throw new RpcException(`option with id:${mediaData.entity_id} not found`);
    }

    // if all media files got handled before
    if (option.optionsGroup.post.ready) {
      throw new RpcException(
        `post with id:${option.optionsGroup.post.uuid} does not have unhandled media files`,
      );
    }

    // add the data to media table in DB
    await this.mediaRepo.add(option, mediaData.file_id, mediaData.entity_type);

    // log message
    this.logger.info(
      'rabbitMQ media message processing: after adding media to DB and before handling readiness',
      {
        data: mediaData,
        timestamp: getNow(),
      },
    );
  }

  async handleMedia(mediaData: MediaDataMessageDto): Promise<void> {
    // handle different media based on its type
    this[`${mediaData.entity_type}Media`](mediaData);
  }
}
