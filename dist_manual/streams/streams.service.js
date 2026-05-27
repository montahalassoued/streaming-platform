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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const redis_service_1 = require("../redis/redis.service");
const stream_entity_1 = require("./entities/stream.entity");
const streamer_entity_1 = require("../streamer/entities/streamer.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const node_crypto_1 = require("node:crypto");
let StreamsService = class StreamsService {
    constructor(streamRepo, streamerRepo, categoryRepo, redisService) {
        this.streamRepo = streamRepo;
        this.streamerRepo = streamerRepo;
        this.categoryRepo = categoryRepo;
        this.redisService = redisService;
    }
    async getLiveStreams(categoryId, page = 1, limit = 20) {
        const qb = this.streamRepo
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.streamer", "streamer")
            .leftJoinAndSelect("s.category", "category")
            .where("s.is_live = true");
        if (categoryId)
            qb.andWhere("s.category_id = :categoryId", { categoryId });
        qb.skip((page - 1) * limit).take(limit);
        const streams = await qb.getMany();
        const withCounts = await Promise.all(streams.map(async (s) => ({
            stream: s,
            viewers: await this.redisService.getViewerCount(s.id),
        })));
        withCounts.sort((a, b) => b.viewers - a.viewers);
        return withCounts.map((w) => ({ ...w.stream, viewerCount: w.viewers }));
    }
    async getStreamById(id) {
        const stream = await this.streamRepo.findOne({
            where: { id },
            relations: { streamer: true, category: true },
        });
        if (!stream)
            throw new common_1.NotFoundException("Stream not found");
        return stream;
    }
    async findOne(id) {
        return this.streamRepo.findOne({
            where: { id },
            relations: { streamer: true, category: true },
        });
    }
    async getStreamByUserId(userId) {
        const streamer = await this.streamerRepo.findOneBy({ userId });
        if (!streamer)
            throw new common_1.NotFoundException("Streamer not found");
        const stream = await this.streamRepo.findOneBy({ streamerId: streamer.id });
        if (!stream)
            throw new common_1.NotFoundException("Stream not found");
        return stream;
    }
    async getStreamKey(userId) {
        const streamer = await this.streamerRepo.findOneBy({ userId });
        if (!streamer)
            throw new common_1.NotFoundException("Streamer not found");
        return { streamKey: streamer.streamKey };
    }
    async createStream(userId, dto) {
        const streamer = await this.streamerRepo.findOneBy({ userId });
        if (!streamer)
            throw new common_1.NotFoundException("Streamer not found");
        const existing = await this.streamRepo.findOneBy({
            streamerId: streamer.id,
        });
        if (existing)
            throw new common_1.ForbiddenException("Stream already exists for this user");
        const stream = this.streamRepo.create({
            streamerId: streamer.id,
            categoryId: dto.categoryId ?? null,
            title: dto.title,
            rtmpUrl: dto.rtmpUrl ?? `rtmp://example/${(0, node_crypto_1.randomUUID)()}`,
            hlsUrl: dto.hlsUrl ?? `https://example/hls/${(0, node_crypto_1.randomUUID)()}.m3u8`,
            isLive: Boolean(dto.isLive ?? false),
            startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
        });
        return this.streamRepo.save(stream);
    }
    async updateStream(id, userId, dto) {
        const stream = await this.streamRepo.findOne({
            where: { id },
            relations: { streamer: true },
        });
        if (!stream)
            throw new common_1.NotFoundException("Stream not found");
        if (stream.streamer?.userId !== userId)
            throw new common_1.ForbiddenException("Not the owner");
        const wasLive = stream.isLive;
        if (dto.title !== undefined)
            stream.title = dto.title;
        if (dto.categoryId !== undefined)
            stream.categoryId = dto.categoryId;
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
    async verifyStreamKey(streamKey) {
        const streamer = await this.streamerRepo.findOneBy({ streamKey });
        if (!streamer)
            return { valid: false };
        let stream = await this.streamRepo.findOneBy({ streamerId: streamer.id });
        if (!stream) {
            stream = this.streamRepo.create({
                streamerId: streamer.id,
                title: "Live Stream",
                rtmpUrl: `rtmp://${(0, node_crypto_1.randomUUID)()}`,
                hlsUrl: `https://example/hls/${(0, node_crypto_1.randomUUID)()}.m3u8`,
                isLive: true,
                startedAt: new Date(),
            });
            await this.streamRepo.save(stream);
        }
        else {
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
    async onStreamEnded(streamKey) {
        const streamer = await this.streamerRepo.findOneBy({ streamKey });
        if (!streamer)
            throw new common_1.NotFoundException("Streamer not found");
        const stream = await this.streamRepo.findOneBy({ streamerId: streamer.id });
        if (!stream)
            throw new common_1.NotFoundException("Stream not found");
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
    async incrementViewerCount(streamId) {
        return this.redisService.incrementViewerCount(streamId);
    }
    async decrementViewerCount(streamId) {
        return this.redisService.decrementViewerCount(streamId);
    }
    async getViewerCount(streamId) {
        return this.redisService.getViewerCount(streamId);
    }
    async remove(id) {
        const stream = await this.streamRepo.findOneBy({ id });
        if (!stream)
            throw new common_1.NotFoundException("Stream not found");
        await this.streamRepo.remove(stream);
        return { ok: true };
    }
};
exports.StreamsService = StreamsService;
exports.StreamsService = StreamsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stream_entity_1.StreamEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(streamer_entity_1.StreamerEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        redis_service_1.RedisService])
], StreamsService);
