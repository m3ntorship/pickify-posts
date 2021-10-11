import { MigrationInterface, QueryRunner } from 'typeorm';
import { POSTS_SCHEMA } from '../entity.model';

export class makeOptionGroupNameNullable1625146469550
  implements MigrationInterface {
  name = 'makeOptionGroupNameNullable1625146469550';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options_groups" ALTER COLUMN "name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "${POSTS_SCHEMA}"."options_groups"."name" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "${POSTS_SCHEMA}"."options_groups"."name" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options_groups" ALTER COLUMN "name" SET NOT NULL`,
    );
  }
}
