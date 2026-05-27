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
exports.FollowsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const follow_entity_1 = require("./entities/follow.entity");
const user_entity_1 = require("../users/entities/user.entity");
const streamer_entity_1 = require("../streamer/entities/streamer.entity");
let FollowsService = class FollowsService {
    constructor(followRepo, userRepo, streamerRepo) {
        this.followRepo = followRepo;
        this.userRepo = userRepo;
        this.streamerRepo = streamerRepo;
    }
    async follow(followerId, streamerId) {
        if (followerId === streamerId)
            throw new common_1.ConflictException("Cannot follow yourself");
        const streamer = await this.streamerRepo.findOneBy({ userId: streamerId });
        if (!streamer)
            throw new common_1.NotFoundException("Streamer not found");
        const follow = this.followRepo.create({ followerId, streamerId });
        try {
            return await this.followRepo.save(follow);
        }
        catch (err) {
            throw new common_1.ConflictException("Already following this streamer");
        }
    }
    async unfollow(followerId, streamerId) {
        const existing = await this.followRepo.findOneBy({
            followerId,
            streamerId,
        });
        if (!existing)
            throw new common_1.NotFoundException("Follow relationship not found");
        existing.deletedAt = new Date();
        await this.followRepo.save(existing);
        return existing;
    }
    async isFollowing(followerId, streamerId) {
        const q = await this.followRepo.findOne({
            where: { followerId, streamerId },
        });
        return !!q && q.deletedAt == null;
    }
    async getFollowers(streamerId) {
        return this.followRepo
            .find({
            where: { streamerId },
            relations: { follower: true },
            order: { createdAt: "DESC" },
            withDeleted: false,
        })
            .then((rows) => rows.filter((row) => row.deletedAt == null));
    }
    async getFollowing(followerId) {
        return this.followRepo
            .find({
            where: { followerId },
            relations: { streamer: true },
            order: { createdAt: "DESC" },
            withDeleted: false,
        })
            .then((rows) => rows.filter((row) => row.deletedAt == null));
    }
    async getFollowerIds(streamerId) {
        const rows = await this.followRepo
            .createQueryBuilder("f")
            .select(["f.followerId as id"])
            .where("f.streamerId = :streamerId", { streamerId })
            .andWhere("f.deleted_at IS NULL")
            .getRawMany();
        return rows.map((r) => r.id);
    }
};
exports.FollowsService = FollowsService;
exports.FollowsService = FollowsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(follow_entity_1.FollowEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(streamer_entity_1.StreamerEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FollowsService);
