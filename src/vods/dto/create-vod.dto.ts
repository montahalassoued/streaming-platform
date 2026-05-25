import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateVodDto {
  @ApiProperty({ example: "stream-id" })
  streamId!: string;

  @ApiProperty({ example: "Alice VOD 1" })
  title!: string;

  @ApiProperty({ example: "https://cdn.example.com/videos/alice-vod-1.mp4" })
  videoUrl!: string;

  @ApiProperty({ example: "https://cdn.example.com/videos/alice-vod-1.jpg" })
  thumbnailUrl!: string;

  @ApiProperty({ example: 3600 })
  durationSeconds!: number;

  @ApiPropertyOptional({ example: true })
  isPublic?: boolean;
}
