import { MigrationInterface, QueryRunner } from 'typeorm';
import { POSTS_SCHEMA } from '../entity.model';

export class changeColumnNamesToSnakeCase1624519345479
  implements MigrationInterface {
  name = 'changeColumnNamesToSnakeCase1624519345479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP CONSTRAINT "FK_3d4dc54f63e51860aecb575413d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP CONSTRAINT "FK_0fd4decf372b9a2f1a463641057"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" DROP CONSTRAINT "FK_7992119133ff2c1c3d125ab3950"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options_groups" DROP CONSTRAINT "FK_af348e9d2a36446a9e4a4254750"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options" DROP CONSTRAINT "FK_cff2c5c22b420f553677f550126"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" RENAME COLUMN "userId" TO "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options_groups" RENAME COLUMN "postId" TO "post_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options" RENAME COLUMN "optionsGroupId" TO "options_group_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP COLUMN "optionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD "option_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD "user_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD CONSTRAINT "FK_6f0a1ec5165835c82100f15d48a" FOREIGN KEY ("option_id") REFERENCES "${POSTS_SCHEMA}"."options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD CONSTRAINT "FK_ee5a54efe58165197a045d0ea27" FOREIGN KEY ("user_id") REFERENCES "${POSTS_SCHEMA}"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" ADD CONSTRAINT "FK_0f0ad53f96850a0b96f94f80d6a" FOREIGN KEY ("user_id") REFERENCES "${POSTS_SCHEMA}"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options_groups" ADD CONSTRAINT "FK_e207764c4f50f21bd050f0bb138" FOREIGN KEY ("post_id") REFERENCES "${POSTS_SCHEMA}"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options" ADD CONSTRAINT "FK_2f21833a46f72eda5a36d1b07da" FOREIGN KEY ("options_group_id") REFERENCES "${POSTS_SCHEMA}"."options_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options" DROP CONSTRAINT "FK_2f21833a46f72eda5a36d1b07da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options_groups" DROP CONSTRAINT "FK_e207764c4f50f21bd050f0bb138"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" DROP CONSTRAINT "FK_0f0ad53f96850a0b96f94f80d6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP CONSTRAINT "FK_ee5a54efe58165197a045d0ea27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP CONSTRAINT "FK_6f0a1ec5165835c82100f15d48a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" DROP COLUMN "option_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD "optionId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD "userId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options" RENAME COLUMN "options_group_id" TO "optionsGroupId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options_groups" RENAME COLUMN "post_id" TO "postId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" RENAME COLUMN "user_id" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options" ADD CONSTRAINT "FK_cff2c5c22b420f553677f550126" FOREIGN KEY ("optionsGroupId") REFERENCES "${POSTS_SCHEMA}"."options_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."options_groups" ADD CONSTRAINT "FK_af348e9d2a36446a9e4a4254750" FOREIGN KEY ("postId") REFERENCES "${POSTS_SCHEMA}"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."posts" ADD CONSTRAINT "FK_7992119133ff2c1c3d125ab3950" FOREIGN KEY ("userId") REFERENCES "${POSTS_SCHEMA}"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD CONSTRAINT "FK_0fd4decf372b9a2f1a463641057" FOREIGN KEY ("userId") REFERENCES "${POSTS_SCHEMA}"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${POSTS_SCHEMA}"."votes" ADD CONSTRAINT "FK_3d4dc54f63e51860aecb575413d" FOREIGN KEY ("optionId") REFERENCES "${POSTS_SCHEMA}"."options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
