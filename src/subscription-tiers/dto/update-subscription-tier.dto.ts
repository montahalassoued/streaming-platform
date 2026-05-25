import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateSubscriptionTierDto {
  @ApiPropertyOptional({ example: "Bronze" })
  name?: string;

  @ApiPropertyOptional({ example: 499 })
  priceCents?: number;

  @ApiPropertyOptional({ example: "Basic support tier" })
  description?: string | null;
}
