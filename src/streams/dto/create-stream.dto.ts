import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateStreamDto {
  @ApiProperty({ example: "streamer-id" })
  streamerId!: string;

  @ApiPropertyOptional({ example: "category-id" })
  categoryId?: string;

  @ApiProperty({ example: "Alice Live" })
  title!: string;

  @ApiProperty({ example: "rtmp://example/live/alice" })
  rtmpUrl!: string;

  @ApiProperty({ example: "https://cdn.example.com/hls/alice.m3u8" })
  hlsUrl!: string;

  @ApiPropertyOptional({ example: true })
  isLive?: boolean;

  @ApiPropertyOptional({ example: "2026-05-25T18:00:00.000Z" })
  startedAt?: string;

  @ApiPropertyOptional({ example: "2026-05-25T20:00:00.000Z" })
  endedAt?: string;
}
