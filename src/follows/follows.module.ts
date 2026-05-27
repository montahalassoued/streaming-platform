import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowEntity } from "./entities/follow.entity";
import { UserEntity } from "../users/entities/user.entity";
import { StreamerEntity } from "../streamer/entities/streamer.entity";
import { FollowsService } from "./follows.service";
import { FollowsController } from "./follows.controller";
@Module({
  imports: [
    TypeOrmModule.forFeature([FollowEntity, UserEntity, StreamerEntity]),
  ],
  providers: [FollowsService],
  controllers: [FollowsController],
  exports: [FollowsService],
})
export class FollowsModule {}
