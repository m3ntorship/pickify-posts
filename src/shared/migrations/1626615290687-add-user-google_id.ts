import { MigrationInterface, QueryRunner } from 'typeorm';
import { POSTS_SCHEMA } from '../entity.model';

export class addUserGoogleId1626615290687 implements MigrationInterface {
  name = 'addUserGoogleId1626615290687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."users" ADD "google_id" character varying NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."users" DROP COLUMN "google_id"`,
    );
  }
}
