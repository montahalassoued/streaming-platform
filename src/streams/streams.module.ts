import { Module } from "@nestjs/common";
import { StreamsController } from "./streams.controller";
import { StreamsService } from "./streams.service";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [RedisModule],
  controllers: [StreamsController],
  providers: [StreamsService],
  exports: [StreamsService],
})
export class StreamsModule {}
