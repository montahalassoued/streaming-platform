import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StreamerService } from "./streamer.service";
import { StreamerController } from "./streamer.controller";
import { StreamerEntity } from "./entities/streamer.entity";
import { DonationEntity } from "../donations/entities/donation.entity";
import { StreamEntity } from "../streams/entities/stream.entity";
import { StreamSubscriptionEntity } from "../streams/entities/stream-subscription.entity";
import { FollowEntity } from "../follows/entities/follow.entity";
import { ChatMessageEntity } from "../chat/entities/chat-message.entity";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StreamerEntity,
      DonationEntity,
      StreamEntity,
      StreamSubscriptionEntity,
      FollowEntity,
      ChatMessageEntity,
    ]),
    RedisModule,
  ],
  providers: [StreamerService],
  controllers: [StreamerController],
  exports: [StreamerService],
})
export class StreamerModule {}
