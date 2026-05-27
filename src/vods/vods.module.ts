import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VodsController } from "./vods.controller";
import { VodsService } from "./vods.service";
import { VodEntity } from "./entities/vod.entity";
import { StreamEntity } from "../streams/entities/stream.entity";

@Module({
  imports: [TypeOrmModule.forFeature([VodEntity, StreamEntity])],
  controllers: [VodsController],
  providers: [VodsService],
  exports: [VodsService],
})
export class VodsModule {}
