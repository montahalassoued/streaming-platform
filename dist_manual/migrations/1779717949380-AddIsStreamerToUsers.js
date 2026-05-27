"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsStreamerToUsers1779717949380 = void 0;
class AddIsStreamerToUsers1779717949380 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "is_streamer" boolean DEFAULT false`);
        await queryRunner.query(`UPDATE "users" SET "is_streamer" = false WHERE "is_streamer" IS NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "is_streamer"`);
    }
}
exports.AddIsStreamerToUsers1779717949380 = AddIsStreamerToUsers1779717949380;
