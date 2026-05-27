import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsStreamerToUsers1779717949380 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "is_streamer" boolean DEFAULT false`,
    );
    await queryRunner.query(
      `UPDATE "users" SET "is_streamer" = false WHERE "is_streamer" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "is_streamer"`,
    );
  }
}
