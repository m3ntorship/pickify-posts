// Initial migration file to create schema and database tables of this microservice

import { MigrationInterface, QueryRunner } from 'typeorm';
import { POSTS_SCHEMA } from '../entity.model';

export class InitialMigration1622098062239 implements MigrationInterface {
  name = 'InitialMigration1622098062239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS ${POSTS_SCHEMA}`);
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${POSTS_SCHEMA}"."posts" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "caption" character varying, "type" character varying NOT NULL, "is_hidden" boolean NOT NULL, "user_id" integer NOT NULL, "ready" boolean NOT NULL, "created" boolean NOT NULL, CONSTRAINT "PK_ce51cf1824c9e7542c7bf875ab3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${POSTS_SCHEMA}"."options_groups" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "postId" integer, CONSTRAINT "PK_dda446ddd125b7f76e3688f3821" PRIMARY KEY ("id"), CONSTRAINT "FK_af348e9d2a36446a9e4a4254750" FOREIGN KEY ("postId") REFERENCES "${POSTS_SCHEMA}"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${POSTS_SCHEMA}"."options" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "body" character varying NOT NULL, "vote_count" integer NOT NULL, "optionsGroupId" integer, CONSTRAINT "PK_b0ba798adfe36f8d5c9429759f2" PRIMARY KEY ("id"), CONSTRAINT "FK_cff2c5c22b420f553677f550126" FOREIGN KEY ("optionsGroupId") REFERENCES "${POSTS_SCHEMA}"."options_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${POSTS_SCHEMA}"."votes" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "optionId" integer, CONSTRAINT "FK_26c647863c296d49e748b5ef98f" FOREIGN KEY ("optionId") REFERENCES "${POSTS_SCHEMA}"."options"("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS ${POSTS_SCHEMA} CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "${POSTS_SCHEMA}"."options"`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "${POSTS_SCHEMA}"."options_groups"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "${POSTS_SCHEMA}"."posts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "${POSTS_SCHEMA}"."vote"`);
  }
}
