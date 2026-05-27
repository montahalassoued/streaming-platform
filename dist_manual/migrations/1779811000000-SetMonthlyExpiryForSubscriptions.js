"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetMonthlyExpiryForSubscriptions1779811000000 = void 0;
class SetMonthlyExpiryForSubscriptions1779811000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      UPDATE "subscriptions"
      SET "expires_at" = COALESCE("expires_at", COALESCE("created_at", now()) + interval '1 month')
    `);
        await queryRunner.query(`
      ALTER TABLE "subscriptions"
      ALTER COLUMN "expires_at" SET NOT NULL
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "subscriptions"
      ALTER COLUMN "expires_at" DROP NOT NULL
    `);
    }
}
exports.SetMonthlyExpiryForSubscriptions1779811000000 = SetMonthlyExpiryForSubscriptions1779811000000;
