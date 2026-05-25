export class CreateStreamDto {
  streamerId!: string;
  categoryId?: string;
  title!: string;
  rtmpUrl!: string;
  hlsUrl!: string;
  isLive?: boolean;
  startedAt?: string;
  endedAt?: string;
}
