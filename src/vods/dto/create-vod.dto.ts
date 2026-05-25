export class CreateVodDto {
  streamId!: string;
  title!: string;
  videoUrl!: string;
  thumbnailUrl!: string;
  durationSeconds!: number;
  isPublic?: boolean;
}
