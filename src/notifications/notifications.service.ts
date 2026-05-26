import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Response } from "express";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class NotificationsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsService.name);
  private clients = new Map<string, Response>();

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    if (this.redisService.isEnabled) {
      void this.redisService.subscribe("stream.went.live", (payload) => {
        try {
          // For now, notify all connected clients. In future, filter by followers.
          for (const [userId, res] of this.clients.entries()) {
            try {
              this.pushToResponse(res, {
                event: "stream_went_live",
                data: payload,
              });
            } catch (err) {
              this.logger.error(
                "Failed to push notification to user",
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
    }
  }

  onModuleDestroy() {
    for (const res of this.clients.values()) {
      try {
        res.end();
      } catch {}
    }
    this.clients.clear();
  }

  registerClient(userId: string, res: Response) {
    this.clients.set(userId, res);
    this.logger.log(`Registered SSE client for user ${userId}`);
  }

  unregisterClient(userId: string) {
    const res = this.clients.get(userId);
    if (res) {
      try {
        res.end();
      } catch {}
      this.clients.delete(userId);
      this.logger.log(`Unregistered SSE client for user ${userId}`);
    }
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

  private pushToResponse(
    res: Response,
    payload: { event?: string; data: unknown },
  ) {
    if (payload.event) {
      res.write(`event: ${payload.event}\n`);
    }
    res.write(`data: ${JSON.stringify(payload.data)}\n\n`);
  }
}
