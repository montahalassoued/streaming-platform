import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client?: RedisClientType;
  private subscriber?: RedisClientType;
  private subscriptions = new Map<string, Set<(payload: any) => void>>();

  get isEnabled() {
    return Boolean(this.client);
  }

  async onModuleInit() {
    const url = process.env.REDIS_URL;
    if (!url) {
      this.logger.warn("REDIS_URL is not configured, Redis is disabled");
      return;
    }

    this.client = createClient({ url });
    await this.client.connect();
    this.logger.log("Redis connected");

    // create a dedicated subscriber client for pub/sub
    this.subscriber = createClient({ url });
    this.subscriber.on("error", (err) =>
      this.logger.error("Redis subscriber error", err),
    );
    await this.subscriber.connect();
  }

  async onModuleDestroy() {
    await this.client?.quit().catch(() => undefined);
  }

  async incrementViewerCount(streamId: string) {
    if (this.client) {
      return Number(await this.client.incr(this.viewerCountKey(streamId)));
    }

    return 0;
  }

  async decrementViewerCount(streamId: string) {
    if (this.client) {
      const next = Math.max(
        0,
        Number(await this.client.decr(this.viewerCountKey(streamId))),
      );
      if (next === 0) {
        await this.client.del(this.viewerCountKey(streamId));
      }
      return next;
    }

    return 0;
  }

  async getViewerCount(streamId: string) {
    if (this.client) {
      return Number(
        (await this.client.get(this.viewerCountKey(streamId))) ?? 0,
      );
    }

    return 0;
  }

  async setJson<T>(key: string, value: T) {
    if (!this.client) {
      return;
    }

    await this.client.set(key, JSON.stringify(value));
  }

  async publish(channel: string, payload: unknown) {
    if (!this.client) return;
    try {
      await this.client.publish(channel, JSON.stringify(payload));
    } catch (err) {
      this.logger.error("Failed to publish to Redis", err as any);
    }
  }

  async subscribe(channel: string, handler: (payload: any) => void) {
    if (!this.subscriber) return;

    let handlers = this.subscriptions.get(channel);
    if (!handlers) {
      handlers = new Set();
      this.subscriptions.set(channel, handlers);

      // subscribe once and dispatch to registered handlers
      await this.subscriber.subscribe(channel, (message) => {
        try {
          const data = JSON.parse(message);
          const set = this.subscriptions.get(channel);
          if (set) {
            for (const h of set) {
              try {
                h(data);
              } catch (err) {
                this.logger.error(
                  "Redis subscription handler error",
                  err as any,
                );
              }
            }
          }
        } catch (err) {
          this.logger.error("Failed to parse Redis message", err as any);
        }
      });
    }

    handlers.add(handler);
  }

  async getJson<T>(key: string): Promise<T | null> {
    if (!this.client) {
      return null;
    }

    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  private viewerCountKey(streamId: string) {
    return `stream:viewers:${streamId}`;
  }
}
