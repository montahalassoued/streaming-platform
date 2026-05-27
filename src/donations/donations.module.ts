import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DonationsController } from "./donations.controller";
import { DonationsService } from "./donations.service";
import { DonationEntity } from "./entities/donation.entity";
import { PaymentProviderModule } from "./providers/payment-provider.module";

@Module({
  imports: [TypeOrmModule.forFeature([DonationEntity]), PaymentProviderModule],
  controllers: [DonationsController],
  providers: [DonationsService],
  exports: [DonationsService],
})
export class DonationsModule {}
