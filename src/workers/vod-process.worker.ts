import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RedisService } from "../redis/redis.service";
import { VodEntity } from "../vods/entities/vod.entity";
import { StreamEntity } from "../streams/entities/stream.entity";

interface VodProcessPayload {
  streamId: string;
  startedAt?: string | Date | null;
  streamKey?: string;
}

@Injectable()
export class VodProcessWorker implements OnModuleInit {
  private readonly logger = new Logger(VodProcessWorker.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(VodEntity)
    private readonly vodRepo: Repository<VodEntity>,
    @InjectRepository(StreamEntity)
    private readonly streamRepo: Repository<StreamEntity>,
  ) {}

  onModuleInit() {
    if (!this.redisService.isEnabled) {
      this.logger.warn("Redis not available — vod.process worker inactive");
      return;
    }

    void this.redisService.subscribe("vod.process", async (payload) => {
      try {
        await this.handleVodProcess(payload as VodProcessPayload);
      } catch (err) {
        this.logger.error("Error processing vod.process event", err as any);
      }
    });

    this.logger.log("Subscribed to vod.process");
  }

  private async handleVodProcess(payload: VodProcessPayload) {
    const { streamId } = payload;
    if (!streamId) {
      this.logger.warn("vod.process payload missing streamId — skipping");
      return;
    }

    const stream = await this.streamRepo.findOneBy({ id: streamId });
    if (!stream) {
      this.logger.warn(
        `vod.process: stream ${streamId} not found — skipping`,
      );
      return;
    }

    const durationSeconds = this.calcDuration(stream.startedAt, stream.endedAt);

    const existing = await this.vodRepo.findOneBy({ streamId });
    if (existing) {
      existing.videoUrl = stream.hlsUrl;
      existing.isPublic = true;
      existing.durationSeconds = durationSeconds;
      await this.vodRepo.save(existing);
      this.logger.log(`vod.process: updated existing VOD for stream ${streamId}`);
    } else {
      const vod = this.vodRepo.create({
        streamId,
        title: stream.title,
        videoUrl: stream.hlsUrl,
        thumbnailUrl: null,
        durationSeconds,
        isPublic: true,
      });
      await this.vodRepo.save(vod);
      this.logger.log(`vod.process: created new VOD for stream ${streamId}`);
    }
  }

  private calcDuration(
    startedAt: Date | null | undefined,
    endedAt: Date | null | undefined,
  ): number {
    if (!startedAt || !endedAt) return 0;
    const diff = Math.floor(
      (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000,
    );
    return diff > 0 ? diff : 0;
  }
}
