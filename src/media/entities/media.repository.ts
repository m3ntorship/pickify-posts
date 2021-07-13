import { Option } from '../../posts/entities/option.entity';
import { OptiosnGroup } from '../../posts/entities/optionsGroup.entity';
import { Post } from '../../posts/entities/post.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Media } from './media.entity';

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {
  // add media with relation to post entity
  public async addPostMedia(post: Post, mediaId: string): Promise<Media> {
    const media = this.create();
    media.url = mediaId;
    media.post = post;
    return await this.save(media);
  }

  // add media with relation to options_group entity
  public async addOptionsGroupMedia(
    group: OptiosnGroup,
    mediaId: string,
  ): Promise<Media> {
    const media = this.create();
    media.url = mediaId;
    media.optionsGroup = group;
    return await this.save(media);
  }

  // add media with relation to option entity
  public async addOptionMedia(option: Option, mediaId: string): Promise<Media> {
    const media = this.create();
    media.url = mediaId;
    media.option = option;
    return await this.save(media);
  }
}
