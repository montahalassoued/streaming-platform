"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveTierIdFromSubscriptions1779810000000 = void 0;
class RemoveTierIdFromSubscriptions1779810000000 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "tier_id"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "tier_id" uuid NULL`);
    }
}
exports.RemoveTierIdFromSubscriptions1779810000000 = RemoveTierIdFromSubscriptions1779810000000;
