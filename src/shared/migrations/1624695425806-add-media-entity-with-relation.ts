import { MigrationInterface, QueryRunner } from 'typeorm';
import { POSTS_SCHEMA } from '../entity.model';

export class addMediaEntityWithRelation1624695425806
  implements MigrationInterface {
  name = 'addMediaEntityWithRelation1624695425806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "${POSTS_SCHEMA}"."media" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "url" character varying NOT NULL, "post_id" integer, "options_group_id" integer, "option_id" integer, CONSTRAINT "PK_d9b90e0f5dc380280feae4ff2d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" ADD "unhandled_media" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."media" ADD CONSTRAINT "FK_94287a1646e89dc2003e4231201" FOREIGN KEY ("post_id") REFERENCES "${POSTS_SCHEMA}"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."media" ADD CONSTRAINT "FK_5276405beb3d708aed73dbf1fbf" FOREIGN KEY ("options_group_id") REFERENCES "${POSTS_SCHEMA}"."options_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."media" ADD CONSTRAINT "FK_c44c329d838ed4c0e44a7eae47b" FOREIGN KEY ("option_id") REFERENCES "${POSTS_SCHEMA}"."options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."media" DROP CONSTRAINT "FK_c44c329d838ed4c0e44a7eae47b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."media" DROP CONSTRAINT "FK_5276405beb3d708aed73dbf1fbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."media" DROP CONSTRAINT "FK_94287a1646e89dc2003e4231201"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" DROP COLUMN "unhandled_media"`,
    );
    await queryRunner.query(`DROP TABLE "${POSTS_SCHEMA}"."media"`);
  }
}
