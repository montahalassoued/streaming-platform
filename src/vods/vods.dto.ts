export class CreateVodDto {
  streamId!: string;
  title!: string;
  videoUrl!: string;
  thumbnailUrl!: string;
  durationSeconds!: number;
  isPublic?: boolean;
}

export class UpdateVodDto {
  title?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  isPublic?: boolean;
}
