import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VodProcessWorker } from "./vod-process.worker";
import { VodEntity } from "../vods/entities/vod.entity";
import { StreamEntity } from "../streams/entities/stream.entity";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([VodEntity, StreamEntity]),
    RedisModule,
  ],
  providers: [VodProcessWorker],
})
export class WorkersModule {}
