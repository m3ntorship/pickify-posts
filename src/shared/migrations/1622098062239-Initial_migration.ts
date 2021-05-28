import { MigrationInterface, QueryRunner } from 'typeorm';
import { POSTS_SCHEMA } from '../entity.model';

export class InitialMigration1622098062239 implements MigrationInterface {
  name = 'InitialMigration1622098062239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS ${POSTS_SCHEMA}`);
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${POSTS_SCHEMA}"."posts" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(), "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(), "caption" character varying, "type" character varying NOT NULL, "is_hidden" boolean NOT NULL, "user_id" integer NOT NULL, "ready" boolean NOT NULL, "created" boolean NOT NULL, CONSTRAINT "PK_ce51cf1824c9e7542c7bf875ab3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS ${POSTS_SCHEMA} CASCADE`);
  }
}
