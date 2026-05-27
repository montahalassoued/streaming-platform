import { ApiPropertyOptional } from "@nestjs/swagger";
import { DonationStatus } from "../entities/donation.entity";

export class UpdateDonationDto {
  @ApiPropertyOptional({ example: "stream-id" })
  streamId?: string;

  @ApiPropertyOptional({ example: "user-id" })
  userId?: string;

  @ApiPropertyOptional({ example: 500 })
  amountCents?: number;

  @ApiPropertyOptional({ example: "USD" })
  currency?: string;

  @ApiPropertyOptional({ example: "Great stream!" })
  message?: string;

  @ApiPropertyOptional({ example: "completed" })
  status?: DonationStatus;
}
