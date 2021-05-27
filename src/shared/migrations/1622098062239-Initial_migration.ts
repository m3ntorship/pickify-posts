import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1622098062239 implements MigrationInterface {
  name = 'InitialMigration1622098062239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE SCHEMA pickify_posts');
    await queryRunner.query(
      `CREATE TABLE "pickify_posts"."posts" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "caption" character varying, "type" character varying NOT NULL, "is_hidden" boolean NOT NULL, "user_id" integer NOT NULL, "ready" boolean NOT NULL, "created" boolean NOT NULL, CONSTRAINT "PK_ce51cf1824c9e7542c7bf875ab3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP SCHEMA pickify_posts');
    await queryRunner.query(`DROP TABLE "pickify_posts"."posts"`);
  }
}
