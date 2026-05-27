import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionsService } from "./subscriptions.service";
import { SubscriptionsController } from "./subscriptions.controller";
import { StreamSubscriptionEntity } from "../streams/entities/stream-subscription.entity";
import { StreamerEntity } from "../streamer/entities/streamer.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([StreamSubscriptionEntity, StreamerEntity]),
  ],
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
