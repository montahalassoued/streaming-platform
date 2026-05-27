"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const redis_service_1 = require("../redis/redis.service");
const follow_entity_1 = require("../follows/entities/follow.entity");
const SSE_HEARTBEAT_MS = 25_000;
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(redisService, followRepository) {
        this.redisService = redisService;
        this.followRepository = followRepository;
        this.logger = new common_1.Logger(NotificationsService_1.name);
        this.clients = new Map();
        this.heartbeats = new Map();
    }
    onModuleInit() {
        if (this.redisService.isEnabled) {
            void this.redisService.subscribe("stream.went.live", async (payload) => {
                try {
                    const livePayload = this.parseLivePayload(payload);
                    if (!livePayload?.streamerId) {
                        this.logger.warn("Ignoring stream.went.live payload without streamerId");
                        return;
                    }
                    const followers = await this.followRepository.find({
                        where: { streamerId: livePayload.streamerId },
                    });
                    for (const follow of followers) {
                        const res = this.clients.get(follow.followerId);
                        if (!res)
                            continue;
                        try {
                            this.pushToResponse(res, {
                                event: "stream_went_live",
                                data: livePayload,
                            });
                        }
                        catch (err) {
                            this.logger.error("Failed to push notification to follower", err);
                        }
                    }
                }
                catch (err) {
                    this.logger.error("Error handling stream.went.live message", err);
                }
            });
            void this.redisService.subscribe("streamer.settings.updated", (payload) => {
                this.logger.debug(`streamer.settings.updated received (no-op): streamerId=${String(payload?.streamerId ?? "unknown")}`);
            });
        }
    }
    onModuleDestroy() {
        for (const res of this.clients.values()) {
            try {
                res.end();
            }
            catch { }
        }
        for (const timer of this.heartbeats.values()) {
            clearInterval(timer);
        }
        this.clients.clear();
        this.heartbeats.clear();
    }
    registerClient(userId, res) {
        this.clients.set(userId, res);
        const timer = setInterval(() => {
            try {
                res.write(`: heartbeat\n\n`);
            }
            catch {
                this.unregisterClient(userId);
            }
        }, SSE_HEARTBEAT_MS);
        this.heartbeats.set(userId, timer);
        this.logger.log(`Registered SSE client for user ${userId}`);
    }
    unregisterClient(userId) {
        const timer = this.heartbeats.get(userId);
        if (timer) {
            clearInterval(timer);
            this.heartbeats.delete(userId);
        }
        const res = this.clients.get(userId);
        if (res) {
            try {
                res.end();
            }
            catch { }
            this.clients.delete(userId);
        }
        this.logger.log(`Unregistered SSE client for user ${userId}`);
    }
    pushToUser(userId, payload) {
        const res = this.clients.get(userId);
        if (!res)
            return false;
        try {
            this.pushToResponse(res, { event: "notification", data: payload });
            return true;
        }
        catch (err) {
            this.logger.error("Failed to push to user", err);
            return false;
        }
    }
    pushToResponse(res, payload) {
        res.write(`event: ${payload.event}\n`);
        res.write(`data: ${JSON.stringify(payload.data)}\n\n`);
    }
    parseLivePayload(payload) {
        if (!payload || typeof payload !== "object")
            return null;
        const p = payload;
        if (typeof p.streamId !== "string")
            return null;
        if (p.streamerId !== null && typeof p.streamerId !== "string")
            return null;
        if (typeof p.startedAt !== "string")
            return null;
        return {
            streamId: p.streamId,
            streamerId: p.streamerId ?? null,
            startedAt: p.startedAt,
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(follow_entity_1.FollowEntity)),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        typeorm_2.Repository])
], NotificationsService);
