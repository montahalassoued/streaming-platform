import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProviderPaymentIdToDonations1779805000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "donations" ADD COLUMN IF NOT EXISTS "provider_payment_id" varchar NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "donations" DROP COLUMN IF EXISTS "provider_payment_id"`,
    );
  }
}
