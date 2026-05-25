import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateDonationDto {
  @ApiProperty({ example: "stream-id" })
  streamId!: string;

  @ApiProperty({ example: "user-id" })
  userId!: string;

  @ApiProperty({ example: 500 })
  amountCents!: number;

  @ApiProperty({ example: "USD" })
  currency!: string;

  @ApiPropertyOptional({ example: "Great stream!" })
  message?: string;

  @ApiPropertyOptional({ example: "completed" })
  status?: string;
}
