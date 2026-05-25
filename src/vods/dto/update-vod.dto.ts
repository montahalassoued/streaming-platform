import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateVodDto {
  @ApiPropertyOptional({ example: "stream-id" })
  streamId?: string;

  @ApiPropertyOptional({ example: "Alice VOD 1" })
  title?: string;

  @ApiPropertyOptional({
    example: "https://cdn.example.com/videos/alice-vod-1.mp4",
  })
  videoUrl?: string;

  @ApiPropertyOptional({
    example: "https://cdn.example.com/videos/alice-vod-1.jpg",
  })
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 3600 })
  durationSeconds?: number;

  @ApiPropertyOptional({ example: true })
  isPublic?: boolean;
}
