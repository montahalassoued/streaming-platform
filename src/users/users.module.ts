import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UserEntity } from "./entities/user.entity";
import { FollowEntity } from "../follows/entities/follow.entity";
import { DonationEntity } from "../donations/entities/donation.entity";
import { StreamSubscriptionEntity } from "../streams/entities/stream-subscription.entity";
import { StreamerEntity } from "../streamer/entities/streamer.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FollowEntity,
      DonationEntity,
      StreamSubscriptionEntity,
      StreamerEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
