import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ListCategoriesQueryDto {
  @ApiPropertyOptional({ description: "Filter categories by name" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: "Page number (1-based)", default: 1 })
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ description: "Items per page", default: 20 })
  @IsOptional()
  limit?: string;
}
