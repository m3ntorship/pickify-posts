import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateMakeOptionBodyNotRequired1626219362732
  implements MigrationInterface {
  name = 'updateMakeOptionBodyNotRequired1626219362732';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pickify_posts"."options" ALTER COLUMN "body" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "pickify_posts"."options"."body" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "pickify_posts"."options"."body" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pickify_posts"."options" ALTER COLUMN "body" SET NOT NULL`,
    );
  }
}
