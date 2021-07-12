import { MigrationInterface, QueryRunner } from 'typeorm';
import { POSTS_SCHEMA } from '../entity.model';

export class updateOptionsGroupsEntity1624648980278
  implements MigrationInterface {
  name = 'updateOptionsGroupsEntity1624648980278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options_groups" ADD "order" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options_groups" DROP COLUMN "order"`,
    );
  }
}
