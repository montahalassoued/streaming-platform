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
exports.VodsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vod_entity_1 = require("./entities/vod.entity");
const stream_entity_1 = require("../streams/entities/stream.entity");
let VodsService = class VodsService {
    constructor(vodRepo, streamRepo) {
        this.vodRepo = vodRepo;
        this.streamRepo = streamRepo;
    }
    findAll() {
        return this.vodRepo.find({
            relations: { stream: { streamer: true, category: true } },
            order: { createdAt: "DESC" },
        });
    }
    async findOne(id) {
        const vod = await this.vodRepo.findOne({
            where: { id },
            relations: { stream: { streamer: true, category: true } },
        });
        if (!vod) {
            throw new common_1.NotFoundException("VOD not found");
        }
        return vod;
    }
    async create(createVodDto) {
        const stream = await this.streamRepo.findOneBy({ id: createVodDto.streamId });
        if (!stream) {
            throw new common_1.NotFoundException("Stream not found");
        }
        const vod = this.vodRepo.create({
            streamId: createVodDto.streamId,
            title: createVodDto.title,
            videoUrl: createVodDto.videoUrl,
            thumbnailUrl: createVodDto.thumbnailUrl,
            durationSeconds: createVodDto.durationSeconds,
            isPublic: createVodDto.isPublic ?? true,
        });
        return this.vodRepo.save(vod);
    }
    async update(id, updateVodDto) {
        const vod = await this.vodRepo.findOneBy({ id });
        if (!vod) {
            throw new common_1.NotFoundException("VOD not found");
        }
        if (updateVodDto.title !== undefined)
            vod.title = updateVodDto.title;
        if (updateVodDto.videoUrl !== undefined)
            vod.videoUrl = updateVodDto.videoUrl;
        if (updateVodDto.thumbnailUrl !== undefined)
            vod.thumbnailUrl = updateVodDto.thumbnailUrl;
        if (updateVodDto.durationSeconds !== undefined) {
            vod.durationSeconds = updateVodDto.durationSeconds;
        }
        if (updateVodDto.isPublic !== undefined)
            vod.isPublic = updateVodDto.isPublic;
        return this.vodRepo.save(vod);
    }
    async remove(id) {
        const vod = await this.vodRepo.findOneBy({ id });
        if (!vod) {
            throw new common_1.NotFoundException("VOD not found");
        }
        await this.vodRepo.remove(vod);
        return vod;
    }
    findByStreamId(streamId) {
        return this.vodRepo.findOne({
            where: { streamId },
            relations: { stream: true },
        });
    }
};
exports.VodsService = VodsService;
exports.VodsService = VodsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vod_entity_1.VodEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(stream_entity_1.StreamEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VodsService);
