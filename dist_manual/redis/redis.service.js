"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const redis_1 = require("redis");
let RedisService = RedisService_1 = class RedisService {
    constructor() {
        this.logger = new common_1.Logger(RedisService_1.name);
        this.subscriptions = new Map();
    }
    get isEnabled() {
        return Boolean(this.client);
    }
    async onModuleInit() {
        const url = process.env.REDIS_URL;
        if (!url) {
            this.logger.warn("REDIS_URL is not configured, Redis is disabled");
            return;
        }
        this.client = (0, redis_1.createClient)({ url });
        await this.client.connect();
        this.logger.log("Redis connected");
        this.subscriber = (0, redis_1.createClient)({ url });
        this.subscriber.on("error", (err) => this.logger.error("Redis subscriber error", err));
        await this.subscriber.connect();
    }
    async onModuleDestroy() {
        await this.client?.quit().catch(() => undefined);
        await this.subscriber?.quit().catch(() => undefined);
    }
    async incrementViewerCount(streamId) {
        if (this.client) {
            return Number(await this.client.incr(this.viewerCountKey(streamId)));
        }
        return 0;
    }
    async decrementViewerCount(streamId) {
        if (this.client) {
            const next = Math.max(0, Number(await this.client.decr(this.viewerCountKey(streamId))));
            if (next === 0) {
                await this.client.del(this.viewerCountKey(streamId));
            }
            return next;
        }
        return 0;
    }
    async getViewerCount(streamId) {
        if (this.client) {
            return Number((await this.client.get(this.viewerCountKey(streamId))) ?? 0);
        }
        return 0;
    }
    async setJson(key, value) {
        if (!this.client) {
            return;
        }
        await this.client.set(key, JSON.stringify(value));
    }
    async publish(channel, payload) {
        if (!this.client)
            return;
        try {
            await this.client.publish(channel, JSON.stringify(payload));
        }
        catch (err) {
            this.logger.error("Failed to publish to Redis", err);
        }
    }
    async subscribe(channel, handler) {
        if (!this.subscriber)
            return () => { };
        let handlers = this.subscriptions.get(channel);
        if (!handlers) {
            handlers = new Set();
            this.subscriptions.set(channel, handlers);
            await this.subscriber.subscribe(channel, (message) => {
                try {
                    const data = JSON.parse(message);
                    const set = this.subscriptions.get(channel);
                    if (set) {
                        for (const h of set) {
                            try {
                                h(data);
                            }
                            catch (err) {
                                this.logger.error("Redis subscription handler error", err);
                            }
                        }
                    }
                }
                catch (err) {
                    this.logger.error("Failed to parse Redis message", err);
                }
            });
        }
        handlers.add(handler);
        return () => {
            const set = this.subscriptions.get(channel);
            if (!set)
                return;
            set.delete(handler);
            if (set.size === 0) {
                this.subscriptions.delete(channel);
                void this.subscriber?.unsubscribe(channel).catch(() => undefined);
            }
        };
    }
    async getJson(key) {
        if (!this.client) {
            return null;
        }
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
    }
    viewerCountKey(streamId) {
        return `stream:viewers:${streamId}`;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)()
], RedisService);
