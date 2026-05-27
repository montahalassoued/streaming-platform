import { MigrationInterface, QueryRunner } from "typeorm";

export class SetMonthlyExpiryForSubscriptions1779811000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "subscriptions"
      SET "expires_at" = COALESCE("expires_at", COALESCE("created_at", now()) + interval '1 month')
    `);

    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      ALTER COLUMN "expires_at" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "subscriptions"
      ALTER COLUMN "expires_at" DROP NOT NULL
    `);
  }
}
