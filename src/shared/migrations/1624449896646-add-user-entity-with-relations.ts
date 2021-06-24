import { MigrationInterface, QueryRunner } from 'typeorm';
import { POSTS_SCHEMA } from '../entity.model';

export class addUserEntityWithRelations1624449896646
  implements MigrationInterface {
  name = 'addUserEntityWithRelations1624449896646';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP CONSTRAINT "FK_26c647863c296d49e748b5ef98f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "${POSTS_SCHEMA}"."users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "profile_pic" character varying NOT NULL, CONSTRAINT "PK_ddc86645bd3912d2b9a425880cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "${POSTS_SCHEMA}"."votes"."id" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD COLUMN "userId" integer NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" ADD COLUMN "userId" integer NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD CONSTRAINT "PK_7b73af10b8f22d092b684aa3ef4" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD CONSTRAINT "FK_3d4dc54f63e51860aecb575413d" FOREIGN KEY ("optionId") REFERENCES "${POSTS_SCHEMA}"."options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD CONSTRAINT "FK_0fd4decf372b9a2f1a463641057" FOREIGN KEY ("userId") REFERENCES "${POSTS_SCHEMA}"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" ADD CONSTRAINT "FK_7992119133ff2c1c3d125ab3950" FOREIGN KEY ("userId") REFERENCES "${POSTS_SCHEMA}"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" DROP CONSTRAINT "FK_7992119133ff2c1c3d125ab3950"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP CONSTRAINT "FK_0fd4decf372b9a2f1a463641057"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP CONSTRAINT "FK_3d4dc54f63e51860aecb575413d"`,
    );

    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" ADD COLUMN "user_id" integer NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."vots" ADD COLUMN "user_id" integer NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP CONSTRAINT "PK_7b73af10b8f22d092b684aa3ef4"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "${POSTS_SCHEMA}"."votes"."id" IS NULL`,
    );
    await queryRunner.query(`DROP TABLE "${POSTS_SCHEMA}"."users"`);

    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD CONSTRAINT "FK_26c647863c296d49e748b5ef98f" FOREIGN KEY ("optionId") REFERENCES "pickify_posts"."options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
