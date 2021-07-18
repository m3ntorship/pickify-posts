import { MigrationInterface, QueryRunner } from 'typeorm';
import { POSTS_SCHEMA } from '../entity.model';

export class replaceUnhandledMediaWithMediaCount1626102824445
  implements MigrationInterface {
  name = 'replaceUnhandledMediaWithMediaCount1626102824445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" RENAME COLUMN "unhandled_media" TO "media_count"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" RENAME COLUMN "media_count" TO "unhandled_media"`,
    );
  }
}
