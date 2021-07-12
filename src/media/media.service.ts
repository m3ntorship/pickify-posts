import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OptionRepository } from '../posts/entities/option.repository';
import { OptionsGroupRepository } from '../posts/entities/optionsGroup.repository';
import { PostRepository } from '../posts/entities/post.repository';
import { mediaType } from '../shared/enums/mediaType.enum';
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

  // private async getEntity(
  //   mediaData: MediaDataMessageDto,
  // ): Promise<Post | OptiosnGroup | Option> {
  //   switch (mediaData.entity_type) {
  //     case mediaType.POST:
  //       const post = await this.postRepo.findOne({
  //         where: { uuid: mediaData.entity_id },
  //       });

  //       if (!post) {
  //         throw new NotFoundException(
  //           `post with id:${mediaData.entity_id} not found`,
  //         );
  //       }

  //       return post;

  //     case mediaType.OPTION_GROUP:
  //       const optionsGroup = await this.optionsGroupRepo.findOne({
  //         where: { uuid: mediaData.entity_id },
  //       });

  //       if (!optionsGroup) {
  //         throw new NotFoundException(
  //           `options_group with id:${mediaData.entity_id} not found`,
  //         );
  //       }

  //       return optionsGroup;

  //     case mediaType.OPTION:
  //       const option = await this.optionRepo.findOne({
  //         where: { uuid: mediaData.entity_id },
  //       });

  //       if (!option) {
  //         throw new NotFoundException(
  //           `option with id:${mediaData.entity_id} not found`,
  //         );
  //       }

  //       return option;

  //     default:
  //       break;
  //   }
  // }

  // async handleMedia(mediaData: MediaDataMessageDto) {
  //   // get the (post | group | option) from DB
  //   const entity = await this.getEntity(mediaData);

  //   // add the data to media table in DB
  //   await this.mediaRepo.add(entity, mediaData.file_id, mediaData.entity_type);

  //   // decrease unhandled_media column in posts table
  //   // & make post ready=true if unhandled_media = 0
  //   await this.postService.handleReadiness(mediaData.entity_type, entity);
  // }

  async handleMedia(mediaData: MediaDataMessageDto): Promise<void> {
    switch (mediaData.entity_type) {
      case mediaType.POST:
        const post = await this.postRepo.getPostById(mediaData.entity_id);

        if (!post) {
          throw new RpcException(
            `Post with id:${mediaData.entity_id} not found`,
          );
        }

        // if all media files got handled before
        if (post.unhandled_media === 0) {
          throw new RpcException(
            `post with id:${post.uuid} does not have unhandled media files`,
          );
        }

        // add the data to media table in DB
        await this.mediaRepo.add(
          post,
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

        // decrease unhandled_media column in posts table
        // & make post ready=true if unhandled_media = 0
        await this.postRepo.handleReadiness(post);
        break;

      case mediaType.OPTION_GROUP:
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
        if (optionsGroup.post.unhandled_media === 0) {
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

        // get the post of the group
        const optionGroupPost = await this.postRepo.getPostById(
          optionsGroup.post.uuid,
        );

        // decrease unhandled_media column in posts table
        // & make post ready=true if unhandled_media = 0
        await this.postRepo.handleReadiness(optionGroupPost);
        break;

      case mediaType.OPTION:
        // get the option with relation to post
        const option = await this.optionRepo.getByID(
          mediaData.entity_id,
          'post',
        );
        // if option is not found
        if (!option) {
          throw new RpcException(
            `option with id:${mediaData.entity_id} not found`,
          );
        }

        // if all media files got handled before
        if (option.optionsGroup.post.unhandled_media === 0) {
          throw new RpcException(
            `post with id:${option.optionsGroup.post.uuid} does not have unhandled media files`,
          );
        }

        // add the data to media table in DB
        await this.mediaRepo.add(
          option,
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

        // get the post of the option
        const optionPost = await this.postRepo.getPostById(
          option.optionsGroup.post.uuid,
        );

        // decrease unhandled_media column in posts table
        // & make post ready=true if unhandled_media = 0
        await this.postRepo.handleReadiness(optionPost);
        break;

      default:
        break;
    }
  }
}
