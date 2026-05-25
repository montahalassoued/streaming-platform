export class CreateCategoryDto {
  name!: string;
  slug!: string;
  parentId?: string;
  thumbnailUrl?: string;
}
