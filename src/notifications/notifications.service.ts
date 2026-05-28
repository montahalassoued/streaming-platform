import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Response } from "express";
import { Repository } from "typeorm";
import { RedisService } from "../redis/redis.service";
import { FollowEntity } from "../follows/entities/follow.entity";
import { NotificationEvent } from "./dto/notification-event.dto";

interface StreamWentLivePayload {
  streamId: string;
  streamerId: string | null;
  startedAt: string;
}


const SSE_HEARTBEAT_MS = 25_000;

@Injectable()
export class NotificationsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsService.name);
  private clients = new Map<string, Response>();
  private heartbeats = new Map<string, ReturnType<typeof setInterval>>();

  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  onModuleInit() {
    if (this.redisService.isEnabled) {
      void this.redisService.subscribe("stream.went.live", async (payload) => {
        try {
          const livePayload = this.parseLivePayload(payload);
          if (!livePayload?.streamerId) {
            this.logger.warn(
              "Ignoring stream.went.live payload without streamerId",
            );
            return;
          }

          const followers = await this.followRepository.find({
            where: { streamerId: livePayload.streamerId },
          });

          for (const follow of followers) {
            const res = this.clients.get(follow.followerId);
            if (!res) continue;

            try {
              this.pushToResponse(res, {
                event: "stream_went_live",
                data: livePayload,
              });
            } catch (err) {
              this.logger.error(
                "Failed to push notification to follower",
                err as any,
              );
            }
          }
        } catch (err) {
          this.logger.error(
            "Error handling stream.went.live message",
            err as any,
          );
        }
      });
      void this.redisService.subscribe(
        "streamer.settings.updated",
        (payload) => {
          this.logger.debug(
            `streamer.settings.updated received (no-op): streamerId=${String(
              (payload as { streamerId?: string })?.streamerId ?? "unknown",
            )}`,
          );
        },
      );
    }
  }

  onModuleDestroy() {
    for (const res of this.clients.values()) {
      try {
        res.end();
      } catch {}
    }
    for (const timer of this.heartbeats.values()) {
      clearInterval(timer);
    }
    this.clients.clear();
    this.heartbeats.clear();
  }

  registerClient(userId: string, res: Response) {
    this.clients.set(userId, res);
    const timer = setInterval(() => {
      try {
        res.write(`: heartbeat\n\n`);
      } catch {
        this.unregisterClient(userId);
      }
    }, SSE_HEARTBEAT_MS);
    this.heartbeats.set(userId, timer);
    this.logger.log(`Registered SSE client for user ${userId}`);
  }

  unregisterClient(userId: string) {
    const timer = this.heartbeats.get(userId);
    if (timer) {
      clearInterval(timer);
      this.heartbeats.delete(userId);
    }
    const res = this.clients.get(userId);
    if (res) {
      try {
        res.end();
      } catch {}
      this.clients.delete(userId);
    }
    this.logger.log(`Unregistered SSE client for user ${userId}`);
  }

  pushToUser(userId: string, payload: unknown) {
    const res = this.clients.get(userId);
    if (!res) return false;
    try {
      this.pushToResponse(res, { event: "notification", data: payload });
      return true;
    } catch (err) {
      this.logger.error("Failed to push to user", err as any);
      return false;
    }
  }

  private pushToResponse(res: Response, payload: NotificationEvent) {
    res.write(`event: ${payload.event}\n`);
    res.write(`data: ${JSON.stringify(payload.data)}\n\n`);
  }

  private parseLivePayload(payload: unknown): StreamWentLivePayload | null {
    if (!payload || typeof payload !== "object") return null;

    const p = payload as Partial<StreamWentLivePayload>;
    if (typeof p.streamId !== "string") return null;
    if (p.streamerId !== null && typeof p.streamerId !== "string") return null;
    if (typeof p.startedAt !== "string") return null;

    return {
      streamId: p.streamId,
      streamerId: p.streamerId ?? null,
      startedAt: p.startedAt,
    };
  }
}
