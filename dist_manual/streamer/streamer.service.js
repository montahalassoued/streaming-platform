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
exports.StreamerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stream_entity_1 = require("../streams/entities/stream.entity");
const donation_entity_1 = require("../donations/entities/donation.entity");
const stream_subscription_entity_1 = require("../streams/entities/stream-subscription.entity");
const follow_entity_1 = require("../follows/entities/follow.entity");
const chat_message_entity_1 = require("../chat/entities/chat-message.entity");
const streamer_entity_1 = require("./entities/streamer.entity");
const redis_service_1 = require("../redis/redis.service");
let StreamerService = class StreamerService {
    constructor(streamRepo, donationRepo, followRepo, chatRepo, streamerRepo, redisService) {
        this.streamRepo = streamRepo;
        this.donationRepo = donationRepo;
        this.followRepo = followRepo;
        this.chatRepo = chatRepo;
        this.streamerRepo = streamerRepo;
        this.redisService = redisService;
    }
    async getStreamerByUser(userId) {
        const streamer = await this.streamerRepo.findOneBy({ userId });
        if (!streamer)
            throw new common_1.NotFoundException("Streamer not found");
        return streamer;
    }
    async getDonationsReceived(userId, page = 1, limit = 20) {
        const streams = await this.streamRepo.findBy({
            streamerId: (await this.getStreamerByUser(userId)).id,
        });
        const streamIds = streams.map((s) => s.id);
        if (streamIds.length === 0)
            return {
                data: [],
                meta: {
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPrevPage: false,
                },
            };
        const [items, total] = await this.donationRepo
            .createQueryBuilder("d")
            .where("d.stream_id IN (:...ids)", { ids: streamIds })
            .orderBy("d.created_at", "DESC")
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data: items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: total > page * limit,
                hasPrevPage: page > 1,
            },
        };
    }
    async getSubscribers(userId) {
        const streamer = await this.getStreamerByUser(userId);
        return this.followRepo.find({
            where: { streamerId: streamer.userId },
            relations: ["follower"],
        });
    }
    async updateChannelSettings(userId, dto) {
        const streamer = await this.getStreamerByUser(userId);
        if (dto.channelDescription !== undefined)
            streamer.bio = dto.channelDescription;
        await this.streamerRepo.save(streamer);
        void this.redisService.publish("streamer.settings.updated", {
            streamerId: streamer.id,
        });
        return streamer;
    }
    async deleteChatMessage(streamerUserId, messageId) {
        const message = await this.chatRepo.findOneBy({ id: messageId });
        if (!message)
            throw new common_1.NotFoundException("Message not found");
        const stream = await this.streamRepo.findOneBy({ id: message.streamId });
        if (!stream)
            throw new common_1.NotFoundException("Stream not found");
        const streamer = await this.getStreamerByUser(streamerUserId);
        if (stream.streamerId !== streamer.id)
            throw new common_1.ForbiddenException("Not the owner");
        message.isDeleted = true;
        await this.chatRepo.save(message);
        void this.redisService.publish("chat.message.deleted", { messageId });
        return { ok: true };
    }
};
exports.StreamerService = StreamerService;
exports.StreamerService = StreamerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stream_entity_1.StreamEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(donation_entity_1.DonationEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(stream_subscription_entity_1.StreamSubscriptionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(follow_entity_1.FollowEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessageEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(streamer_entity_1.StreamerEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        redis_service_1.RedisService])
], StreamerService);
