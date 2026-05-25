import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateStreamDto {
  @ApiPropertyOptional({ example: "streamer-id" })
  streamerId?: string;

  @ApiPropertyOptional({ example: "category-id" })
  categoryId?: string;

  @ApiPropertyOptional({ example: "Alice Live" })
  title?: string;

  @ApiPropertyOptional({ example: "rtmp://example/live/alice" })
  rtmpUrl?: string;

  @ApiPropertyOptional({ example: "https://cdn.example.com/hls/alice.m3u8" })
  hlsUrl?: string;

  @ApiPropertyOptional({ example: true })
  isLive?: boolean;

  @ApiPropertyOptional({ example: "2026-05-25T18:00:00.000Z" })
  startedAt?: string;

  @ApiPropertyOptional({ example: "2026-05-25T20:00:00.000Z" })
  endedAt?: string;
}
