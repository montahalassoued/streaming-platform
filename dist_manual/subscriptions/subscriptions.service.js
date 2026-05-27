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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stream_subscription_entity_1 = require("../streams/entities/stream-subscription.entity");
const streamer_entity_1 = require("../streamer/entities/streamer.entity");
let SubscriptionsService = class SubscriptionsService {
    constructor(subscriptionRepo, streamerRepo) {
        this.subscriptionRepo = subscriptionRepo;
        this.streamerRepo = streamerRepo;
    }
    async subscribeToStreamer(userId, streamerId) {
        let streamer = await this.streamerRepo.findOneBy({ id: streamerId });
        if (!streamer)
            streamer = await this.streamerRepo.findOneBy({ userId: streamerId });
        if (!streamer)
            throw new common_1.NotFoundException("Streamer not found");
        const existing = await this.subscriptionRepo.findOne({
            where: { userId, streamerId },
        });
        const now = new Date();
        const baseDate = existing?.expiresAt && existing.expiresAt > now ? existing.expiresAt : now;
        const expires = this.addOneMonth(baseDate);
        if (existing) {
            existing.streamerId = streamer.id;
            existing.expiresAt = expires;
            return this.subscriptionRepo.save(existing);
        }
        const sub = this.subscriptionRepo.create({
            userId,
            streamerId: streamer.id,
            expiresAt: expires,
        });
        return this.subscriptionRepo.save(sub);
    }
    addOneMonth(date) {
        const next = new Date(date);
        next.setMonth(next.getMonth() + 1);
        return next;
    }
    async getUserSubscriptions(userId) {
        return this.subscriptionRepo.findBy({ userId });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stream_subscription_entity_1.StreamSubscriptionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(streamer_entity_1.StreamerEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SubscriptionsService);
