import { MigrationInterface, QueryRunner } from 'typeorm';
import { POSTS_SCHEMA } from '../entity.model';

export class addReportEntity1630129937488 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "${POSTS_SCHEMA}"."postsReports" ("id" SERIAL PRIMARY KEY NOT NULL, "uuid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."postsReports" ADD COLUMN "reporterId" integer NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."postsReports" ADD CONSTRAINT "postsReports_reporterId_FKEY" FOREIGN KEY ("reporterId") REFERENCES "${POSTS_SCHEMA}"."users"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."postsReports" ADD COLUMN "postId" integer NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."postsReports" ADD CONSTRAINT "postsReports_postId_FKEY" FOREIGN KEY ("postId") REFERENCES "${POSTS_SCHEMA}"."posts"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX reporterConstraint ON "${POSTS_SCHEMA}"."postsReports" USING btree
            ("reporterId" ASC NULLS FIRST,
              "postId" ASC NULLS FIRST)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."postsReports" DROP CONSTRAINT "postsReports_reporterId_FKEY" `,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."postsReports" DROP COLUMN IF EXISTS "reporterId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."postsReports" DROP CONSTRAINT "postsReports_postId_FKEY" `,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."postsReports" DROP COLUMN IF EXISTS "postId"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS reporterConstraint`);
    await queryRunner.query(`DROP TABLE "${POSTS_SCHEMA}"."postsReports"`);
  }
}
