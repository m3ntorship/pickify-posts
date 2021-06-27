import { Option } from '../../posts/entities/option.entity';
import { OptiosnGroup } from 'src/posts/entities/optionsGroup.entity';
import { Post } from '../../posts/entities/post.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Media } from './media.entity';
import { mediaType } from 'src/shared/enums/mediaType.enum';

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {
  public async add(
    entity: Post | Option | OptiosnGroup,
    id: string,
    entityType: string,
  ): Promise<Media> {
    const media = this.create();
    media.url = id;
    switch (entityType) {
      case mediaType.POST:
        media.post = entity as Post;
        break;
      case mediaType.OPTION_GROUP:
        media.optionsGroup = entity as OptiosnGroup;
        break;
      case mediaType.OPTION:
        media.option = entity as Option;
        break;

      default:
        break;
    }
    return await this.save(media);
  }
}
