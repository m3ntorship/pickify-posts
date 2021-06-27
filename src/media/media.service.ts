import { Injectable } from '@nestjs/common';
import { Option } from 'src/posts/entities/option.entity';
import { OptionRepository } from 'src/posts/entities/option.repository';
import { OptiosnGroup } from 'src/posts/entities/optionsGroup.entity';
import { OptionsGroupRepository } from 'src/posts/entities/optionsGroup.repository';
import { Post } from 'src/posts/entities/post.entity';
import { PostRepository } from 'src/posts/entities/post.repository';
import { mediaType } from 'src/shared/enums/mediaType.enum';
import { MediaDataMessageDto } from './dto/mediaDataMessage-dto';
import { MediaRepository } from './entities/media.repository';

@Injectable()
export class MediaService {
  constructor(
    private mediaRepo: MediaRepository,
    private postRepo: PostRepository,
    private optionRepo: OptionRepository,
    private optionsGroupRepo: OptionsGroupRepository,
  ) {}

  private async getEntity(
    entityType: MediaDataMessageDto,
  ): Promise<Post | OptiosnGroup | Option> {
    switch (entityType.entity_type) {
      case mediaType.POST:
        return await this.postRepo.findOne({
          where: { uuid: entityType.entity_id },
        });

      case mediaType.OPTION_GROUP:
        return await this.optionsGroupRepo.findOne({
          where: { uuid: entityType.entity_id },
        });

      case mediaType.OPTION:
        return await this.optionRepo.findOne({
          where: { uuid: entityType.entity_id },
        });

      default:
        break;
    }
  }

  async handleMedia(mediaData: MediaDataMessageDto) {
    // get the (post | group | option) from DB
    const entity = await this.getEntity(mediaData);

    // add the data to media table in DB
    await this.mediaRepo.add(entity, mediaData.file_id, mediaData.entity_type);

    // change post rediness if all media files in post got handled
    // TODO
  }
}
