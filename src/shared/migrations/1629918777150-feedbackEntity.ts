import { MigrationInterface, QueryRunner } from 'typeorm';
import { POSTS_SCHEMA } from '../entity.model';

export class feedbackEntity1629918777150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "${POSTS_SCHEMA}"."feedbacks" ("id" SERIAL PRIMARY KEY NOT NULL, "uuid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "feedback_body" character varying, "feedback_rating" integer NOT NULL)`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."feedbacks" ADD COLUMN "userId" integer NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."feedbacks" ADD CONSTRAINT "feedbacks_userId_FKEY" FOREIGN KEY ("userId") REFERENCES "${POSTS_SCHEMA}"."users"("id") ON DELETE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."feedback" DROP CONSTRAINT "feedbacks_userId_FKEY" `,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."feedbacks" DROP COLUMN IF EXISTS"userId"`,
    );
    await queryRunner.query(`DROP TABLE "${POSTS_SCHEMA}"."feedbacks"`);
  }
}
