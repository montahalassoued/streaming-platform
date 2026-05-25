export class CreateCategoryDto {
  name!: string;
  slug!: string;
  parentId?: string;
  thumbnailUrl?: string;
}

export class UpdateCategoryDto {
  name?: string;
  slug?: string;
  parentId?: string;
  thumbnailUrl?: string;
}
