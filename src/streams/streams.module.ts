import { Module } from "@nestjs/common";
import { StreamsController } from "./streams.controller";
import { StreamsService } from "./streams.service";
import { RedisModule } from "../redis/redis.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StreamEntity } from "./entities/stream.entity";
import { StreamerEntity } from "../streamer/entities/streamer.entity";
import { CategoryEntity } from "../categories/entities/category.entity";

@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forFeature([StreamEntity, StreamerEntity, CategoryEntity]),
  ],
  controllers: [StreamsController],
  providers: [StreamsService],
  exports: [StreamsService],
})
export class StreamsModule {}
