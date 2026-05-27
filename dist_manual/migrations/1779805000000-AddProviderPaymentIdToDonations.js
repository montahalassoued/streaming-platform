"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProviderPaymentIdToDonations1779805000000 = void 0;
class AddProviderPaymentIdToDonations1779805000000 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "donations" ADD COLUMN IF NOT EXISTS "provider_payment_id" varchar NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "donations" DROP COLUMN IF EXISTS "provider_payment_id"`);
    }
}
exports.AddProviderPaymentIdToDonations1779805000000 = AddProviderPaymentIdToDonations1779805000000;
