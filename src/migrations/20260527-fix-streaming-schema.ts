import { MigrationInterface, QueryRunner } from "typeorm";

export class FixStreamingSchema1780000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create chat_message_reactions table for the new reaction entity
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

    // 2. Make vods.thumbnail_url nullable — the vod.process worker cannot generate
    //    thumbnails automatically; requiring a value would cause worker failures.
    await queryRunner.query(`
      ALTER TABLE "vods" ALTER COLUMN "thumbnail_url" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "chat_message_reactions"`);
    await queryRunner.query(`
      ALTER TABLE "vods" ALTER COLUMN "thumbnail_url" SET NOT NULL
    `);
  }
}
