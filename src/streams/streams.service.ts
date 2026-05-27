import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateStreamDto } from "./dto/create-stream.dto";
import { UpdateStreamDto } from "./dto/update-stream.dto";
import { RedisService } from "../redis/redis.service";
import { StreamEntity } from "./entities/stream.entity";
import { StreamerEntity } from "../streamer/entities/streamer.entity";
import { CategoryEntity } from "../categories/entities/category.entity";
import { randomUUID } from "node:crypto";

@Injectable()
export class StreamsService {
  constructor(
    @InjectRepository(StreamEntity)
    private readonly streamRepo: Repository<StreamEntity>,
    @InjectRepository(StreamerEntity)
    private readonly streamerRepo: Repository<StreamerEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    private readonly redisService: RedisService,
  ) {}

  async getLiveStreams(categoryId?: string, page = 1, limit = 20) {
    const qb = this.streamRepo
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.streamer", "streamer")
      .leftJoinAndSelect("s.category", "category")
      .where("s.is_live = true");
    if (categoryId) qb.andWhere("s.category_id = :categoryId", { categoryId });
    qb.skip((page - 1) * limit).take(limit);
    const streams = await qb.getMany();

    const withCounts = await Promise.all(
      streams.map(async (s) => ({
        stream: s,
        viewers: await this.redisService.getViewerCount(s.id),
      })),
    );
    withCounts.sort((a, b) => b.viewers - a.viewers);
    return withCounts.map((w) => ({ ...w.stream, viewerCount: w.viewers }));
  }

  async getStreamById(id: string) {
    const stream = await this.streamRepo.findOne({
      where: { id },
      relations: { streamer: true, category: true },
    });
    if (!stream) throw new NotFoundException("Stream not found");
    return stream;
  }

  async findOne(id: string) {
    return this.streamRepo.findOne({
      where: { id },
      relations: { streamer: true, category: true },
    });
  }
  async getStreamByUserId(userId: string) {
    const streamer = await this.streamerRepo.findOneBy({ userId });
    if (!streamer) throw new NotFoundException("Streamer not found");
    const stream = await this.streamRepo.findOneBy({ streamerId: streamer.id });
    if (!stream) throw new NotFoundException("Stream not found");
    return stream;
  }

  async getStreamKey(userId: string) {
    const streamer = await this.streamerRepo.findOneBy({ userId });
    if (!streamer) throw new NotFoundException("Streamer not found");
    return { streamKey: streamer.streamKey };
  }

  async createStream(userId: string, dto: CreateStreamDto) {
    const streamer = await this.streamerRepo.findOneBy({ userId });
    if (!streamer) throw new NotFoundException("Streamer not found");
    const existing = await this.streamRepo.findOneBy({
      streamerId: streamer.id,
    });
    if (existing)
      throw new ForbiddenException("Stream already exists for this user");

    const stream = this.streamRepo.create({
      streamerId: streamer.id,
      categoryId: dto.categoryId ?? null,
      title: dto.title,
      rtmpUrl: dto.rtmpUrl ?? `rtmp://example/${randomUUID()}`,
      hlsUrl: dto.hlsUrl ?? `https://example/hls/${randomUUID()}.m3u8`,
      isLive: Boolean(dto.isLive ?? false),
      startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
    } as any);

    return this.streamRepo.save(stream);
  }

  async updateStream(id: string, userId: string, dto: UpdateStreamDto) {
    const stream = await this.streamRepo.findOne({
      where: { id },
      relations: { streamer: true },
    });
    if (!stream) throw new NotFoundException("Stream not found");
    if (stream.streamer?.userId !== userId)
      throw new ForbiddenException("Not the owner");

    const wasLive = stream.isLive;
    if (dto.title !== undefined) stream.title = dto.title;
    if (dto.categoryId !== undefined) stream.categoryId = dto.categoryId as any;

    if (dto.isLive !== undefined) {
      stream.isLive = dto.isLive;
      if (dto.isLive && !wasLive) {
        stream.startedAt = new Date();
        void this.redisService.publish("chat.system.message", {
          streamId: stream.id,
          content: "Streamer started the stream.",
          type: "system",
        });
        void this.redisService.publish("stream.went.live", {
          streamerId: userId,
          streamId: stream.id,
          title: stream.title,
        });
      }
      if (!dto.isLive && wasLive) {
        stream.endedAt = new Date();
        void this.redisService.publish("chat.system.message", {
          streamId: stream.id,
          content: "Stream ended.",
          type: "system",
        });
        void this.redisService.publish("vod.process", {
          streamId: stream.id,
          startedAt: stream.startedAt,
        });
      }
    }

    return this.streamRepo.save(stream);
  }

  async verifyStreamKey(streamKey: string) {
    const streamer = await this.streamerRepo.findOneBy({ streamKey });
    if (!streamer) return { valid: false };
    let stream = await this.streamRepo.findOneBy({ streamerId: streamer.id });
    if (!stream) {
      stream = this.streamRepo.create({
        streamerId: streamer.id,
        title: "Live Stream",
        rtmpUrl: `rtmp://${randomUUID()}`,
        hlsUrl: `https://example/hls/${randomUUID()}.m3u8`,
        isLive: true,
        startedAt: new Date(),
      });
      await this.streamRepo.save(stream);
    } else {
      stream.isLive = true;
      stream.startedAt = new Date();
      await this.streamRepo.save(stream);
    }

    void this.redisService.publish("chat.system.message", {
      streamId: stream.id,
      content: "Streamer started the stream.",
      type: "system",
    });
    void this.redisService.publish("stream.went.live", {
      streamerId: streamer.userId,
      streamId: stream.id,
      title: stream.title,
    });

    return { valid: true };
  }

  async onStreamEnded(streamKey: string) {
    const streamer = await this.streamerRepo.findOneBy({ streamKey });
    if (!streamer) throw new NotFoundException("Streamer not found");
    const stream = await this.streamRepo.findOneBy({ streamerId: streamer.id });
    if (!stream) throw new NotFoundException("Stream not found");
    stream.isLive = false;
    stream.endedAt = new Date();
    await this.streamRepo.save(stream);
    void this.redisService.publish("vod.process", {
      streamId: stream.id,
      streamKey: streamer.streamKey,
      startedAt: stream.startedAt,
    });
    return { ok: true };
  }

  async incrementViewerCount(streamId: string) {
    return this.redisService.incrementViewerCount(streamId);
  }

  async decrementViewerCount(streamId: string) {
    return this.redisService.decrementViewerCount(streamId);
  }

  async getViewerCount(streamId: string) {
    return this.redisService.getViewerCount(streamId);
  }

  async remove(id: string) {
    const stream = await this.streamRepo.findOneBy({ id });
    if (!stream) throw new NotFoundException("Stream not found");
    await this.streamRepo.remove(stream);
    return { ok: true };
  }
}
