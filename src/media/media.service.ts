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
      throw new RpcException(
        `rabbitMQ media message: Post with id:${mediaData.entity_id} not found`,
      );
    }

    // if all media files got handled before
    if (post.ready) {
      throw new RpcException(
        `rabbitMQ media message: post with id:${post.uuid} does not have unhandled media files`,
      );
    }

    // add the data to media table in DB
    await this.mediaRepo.addPostMedia(post, mediaData.file_id);
  }

  private async option_groupMedia(
    mediaData: MediaDataMessageDto,
  ): Promise<void> {
    // get the optionsGroup with relation to post
    const optionsGroup = await this.optionsGroupRepo.getByID(
      mediaData.entity_id,
    );

    // if optionsGroup is not found
    if (!optionsGroup) {
      throw new RpcException(
        `rabbitMQ media message: options_group with id:${mediaData.entity_id} not found`,
      );
    }

    // if all media files got handled before
    if (optionsGroup.post.ready) {
      throw new RpcException(
        `rabbitMQ media message: post with id:${optionsGroup.post.uuid} does not have unhandled media files`,
      );
    }

    // add the data to media table in DB
    await this.mediaRepo.addOptionsGroupMedia(optionsGroup, mediaData.file_id);
  }

  private async optionMedia(mediaData: MediaDataMessageDto): Promise<void> {
    // get the option with relation to post
    const option = await this.optionRepo.getByID(mediaData.entity_id);
    // if option is not found
    if (!option) {
      throw new RpcException(
        `rabbitMQ media message: option with id:${mediaData.entity_id} not found`,
      );
    }

    // if all media files got handled before
    if (option.optionsGroup.post.ready) {
      throw new RpcException(
        `rabbitMQ media message: post with id:${option.optionsGroup.post.uuid} does not have unhandled media files`,
      );
    }

    // add the data to media table in DB
    await this.mediaRepo.addOptionMedia(option, mediaData.file_id);
  }

  async handleMedia(mediaData: MediaDataMessageDto): Promise<void> {
    // handle different media based on its type
    this[`${mediaData.entity_type}Media`](mediaData);

    // log message
    this.logger.info('rabbitMQ media message handled successfully', {
      data: mediaData,
      timestamp: getNow(),
    });
  }
}
