import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSubscriptionTierDto {
  @ApiProperty({ example: "Bronze" })
  name!: string;

  @ApiProperty({ example: 499 })
  priceCents!: number;

  @ApiPropertyOptional({ example: "Basic support tier" })
  description?: string | null;
}
