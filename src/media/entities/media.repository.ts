import { Option } from '../../posts/entities/option.entity';
import { OptiosnGroup } from 'src/posts/entities/optionsGroup.entity';
import { Post } from '../../posts/entities/post.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Media } from './media.entity';

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {
  public async add(
    entity: Post | Option | OptiosnGroup,
    url: string,
    entityType: string,
  ): Promise<Media> {
    const media = this.create();
    media.url = url;
    switch (entityType) {
      case 'post':
        media.post = entity as Post;
        break;
      case 'optionsGroup':
        media.optionsGroup = entity as OptiosnGroup;
        break;
      case 'option':
        media.option = entity as Option;
        break;

      default:
        break;
    }
    return await this.save(media);
  }
}
