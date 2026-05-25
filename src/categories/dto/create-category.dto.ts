import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({ example: "Gaming" })
  name!: string;

  @ApiProperty({ example: "gaming" })
  slug!: string;

  @ApiPropertyOptional({ example: "parent-category-id" })
  parentId?: string;

  @ApiPropertyOptional({ example: "https://cdn.example.com/gaming.jpg" })
  thumbnailUrl?: string;
}
