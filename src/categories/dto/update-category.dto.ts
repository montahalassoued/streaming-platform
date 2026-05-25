import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: "Gaming" })
  name?: string;

  @ApiPropertyOptional({ example: "gaming" })
  slug?: string;

  @ApiPropertyOptional({ example: "parent-category-id" })
  parentId?: string;

  @ApiPropertyOptional({ example: "https://cdn.example.com/gaming.jpg" })
  thumbnailUrl?: string;
}
