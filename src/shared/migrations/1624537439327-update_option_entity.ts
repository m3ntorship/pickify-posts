import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateOptionEntity1624537439327 implements MigrationInterface {
  name = 'updateOptionEntity1624537439327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pickify_posts"."options" ADD "order" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pickify_posts"."options" DROP COLUMN "order"`,
    );
  }
}
