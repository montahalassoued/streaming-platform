import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTierIdFromSubscriptions1779810000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "tier_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "tier_id" uuid NULL`,
    );
  }
}
