import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DonationsController } from "./donations.controller";
import { DonationsService } from "./donations.service";
import { DonationEntity } from "./entities/donation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DonationEntity])],
  controllers: [DonationsController],
  providers: [DonationsService],
  exports: [DonationsService],
})
export class DonationsModule {}
