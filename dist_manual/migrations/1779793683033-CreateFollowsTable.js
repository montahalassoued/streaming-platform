"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFollowsTable1779793683033 = void 0;
class CreateFollowsTable1779793683033 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "follows" (
        "follower_id" uuid NOT NULL,
        "streamer_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_follows_follower_streamer" PRIMARY KEY ("follower_id", "streamer_id"),
        CONSTRAINT "FK_follows_follower_id" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_follows_streamer_id" FOREIGN KEY ("streamer_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "follows_streamer_id_idx" ON "follows" ("streamer_id")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "follows_streamer_id_idx"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "follows"`);
    }
}
exports.CreateFollowsTable1779793683033 = CreateFollowsTable1779793683033;
