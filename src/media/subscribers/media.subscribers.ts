import { Media } from '../entities/media.entity';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { PostRepository } from 'src/posts/entities/post.repository';

@EventSubscriber()
export class MediaSubscriber implements EntitySubscriberInterface<Media> {
  constructor(connection: Connection, private postRepository: PostRepository) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Media;
  }

  async afterInsert(event: InsertEvent<Media>) {
    // commit transaction to make the insert available in DB
    await event.queryRunner.commitTransaction();
    // start new transaction for TypeOrm to commit after afterInsert
    await event.queryRunner.startTransaction();

    // get post id of added media
    const postId =
      event.entity.option?.optionsGroup.post.uuid ||
      event.entity.post?.uuid ||
      event.entity.optionsGroup?.post.uuid;

    // handle post readiness
    await this.postRepository.handleReadiness(postId);
  }
}
