import { Module } from "@nestjs/common";
import { VodsController } from "./vods.controller";
import { VodsService } from "./vods.service";

@Module({
  controllers: [VodsController],
  providers: [VodsService],
  exports: [VodsService],
})
export class VodsModule {}
