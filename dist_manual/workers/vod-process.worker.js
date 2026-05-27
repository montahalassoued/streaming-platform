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
var VodProcessWorker_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VodProcessWorker = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const redis_service_1 = require("../redis/redis.service");
const vod_entity_1 = require("../vods/entities/vod.entity");
const stream_entity_1 = require("../streams/entities/stream.entity");
let VodProcessWorker = VodProcessWorker_1 = class VodProcessWorker {
    constructor(redisService, vodRepo, streamRepo) {
        this.redisService = redisService;
        this.vodRepo = vodRepo;
        this.streamRepo = streamRepo;
        this.logger = new common_1.Logger(VodProcessWorker_1.name);
    }
    onModuleInit() {
        if (!this.redisService.isEnabled) {
            this.logger.warn("Redis not available — vod.process worker inactive");
            return;
        }
        void this.redisService.subscribe("vod.process", async (payload) => {
            try {
                await this.handleVodProcess(payload);
            }
            catch (err) {
                this.logger.error("Error processing vod.process event", err);
            }
        });
        this.logger.log("Subscribed to vod.process");
    }
    async handleVodProcess(payload) {
        const { streamId } = payload;
        if (!streamId) {
            this.logger.warn("vod.process payload missing streamId — skipping");
            return;
        }
        const stream = await this.streamRepo.findOneBy({ id: streamId });
        if (!stream) {
            this.logger.warn(`vod.process: stream ${streamId} not found — skipping`);
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
        }
        else {
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
    calcDuration(startedAt, endedAt) {
        if (!startedAt || !endedAt)
            return 0;
        const diff = Math.floor((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000);
        return diff > 0 ? diff : 0;
    }
};
exports.VodProcessWorker = VodProcessWorker;
exports.VodProcessWorker = VodProcessWorker = VodProcessWorker_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(vod_entity_1.VodEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(stream_entity_1.StreamEntity)),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VodProcessWorker);
