import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionTiersService } from "./subscription-tiers.service";
import { SubscriptionTiersController } from "./subscription-tiers.controller";
import { SubscriptionTierEntity } from "./entities/subscription-tier.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionTierEntity])],
  controllers: [SubscriptionTiersController],
  providers: [SubscriptionTiersService],
  exports: [SubscriptionTiersService],
})
export class SubscriptionTiersModule {}
