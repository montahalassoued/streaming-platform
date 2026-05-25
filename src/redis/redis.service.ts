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
