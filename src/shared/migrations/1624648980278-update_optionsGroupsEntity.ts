import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateOptionsGroupsEntity1624648980278
  implements MigrationInterface {
  name = 'updateOptionsGroupsEntity1624648980278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pickify_posts"."options_groups" ADD "order" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pickify_posts"."options_groups" DROP COLUMN "order"`,
    );
  }
}
