"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixStreamingSchema1780000000000 = void 0;
class FixStreamingSchema1780000000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "chat_message_reactions" (
        "id"          uuid          NOT NULL DEFAULT gen_random_uuid(),
        "message_id"  uuid          NOT NULL,
        "user_id"     uuid          NOT NULL,
        "type"        varchar       NOT NULL,
        "created_at"  timestamp     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_chat_message_reactions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cmr_message"
          FOREIGN KEY ("message_id") REFERENCES "chat_messages"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_cmr_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      ALTER TABLE "vods" ALTER COLUMN "thumbnail_url" DROP NOT NULL
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "chat_message_reactions"`);
        await queryRunner.query(`
      ALTER TABLE "vods" ALTER COLUMN "thumbnail_url" SET NOT NULL
    `);
    }
}
exports.FixStreamingSchema1780000000000 = FixStreamingSchema1780000000000;
