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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const follow_entity_1 = require("../follows/entities/follow.entity");
const donation_entity_1 = require("../donations/entities/donation.entity");
const stream_subscription_entity_1 = require("../streams/entities/stream-subscription.entity");
const streamer_entity_1 = require("../streamer/entities/streamer.entity");
let UsersService = class UsersService {
    constructor(usersRepo, followRepo, donationRepo, subscriptionRepo, streamerRepo) {
        this.usersRepo = usersRepo;
        this.followRepo = followRepo;
        this.donationRepo = donationRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.streamerRepo = streamerRepo;
    }
    async findAll() {
        const users = await this.usersRepo.find();
        return users.map(({ passwordHash, ...user }) => user);
    }
    async findOne(id) {
        return (await this.usersRepo.findOneBy({ id })) ?? null;
    }
    async findByEmail(email) {
        return (await this.usersRepo.findOneBy({ email })) ?? null;
    }
    async findByUsername(username) {
        return (await this.usersRepo.findOneBy({ username })) ?? null;
    }
    async findByIdOrThrow(id) {
        const user = await this.usersRepo.findOneBy({ id });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        return user;
    }
    async findByUsernameOrThrow(username) {
        const user = await this.usersRepo.findOneBy({ username });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        return user;
    }
    async getProfile(username) {
        const user = await this.findByUsernameOrThrow(username);
        const followerCount = await this.followRepo.countBy({
            streamerId: user.id,
        });
        const followingCount = await this.followRepo.countBy({
            followerId: user.id,
        });
        const isStreamer = !!(await this.streamerRepo.findOneBy({ userId: user.id }));
        return {
            id: user.id,
            username: user.username,
            name: user.name,
            isStreamer,
            createdAt: user.createdAt,
            followerCount,
            followingCount,
        };
    }
    async updateProfile(userId, partial) {
        const user = await this.usersRepo.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        if (partial.name !== undefined)
            user.name = partial.name;
        return this.usersRepo.save(user);
    }
    async becomeStreamer(userId) {
        const user = await this.usersRepo.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const existing = await this.streamerRepo.findOneBy({ userId });
        if (!existing) {
            const s = this.streamerRepo.create({ userId, streamKey: require("crypto").randomBytes(16).toString("hex") });
            await this.streamerRepo.save(s);
        }
        user.isStreamer = true;
        await this.usersRepo.save(user);
        return { ok: true };
    }
    async create(createUserDto) {
        const user = this.usersRepo.create({
            username: createUserDto.username,
            email: createUserDto.email,
            passwordHash: createUserDto.passwordHash,
            name: createUserDto.name,
            isAdmin: false,
        });
        return this.usersRepo.save(user);
    }
    async update(id, updateUserDto) {
        const user = await this.usersRepo.findOneBy({ id });
        if (!user)
            return null;
        if (updateUserDto.username !== undefined)
            user.username = updateUserDto.username;
        if (updateUserDto.email !== undefined)
            user.email = updateUserDto.email;
        if (updateUserDto.passwordHash !== undefined)
            user.passwordHash = updateUserDto.passwordHash;
        if (updateUserDto.name !== undefined)
            user.name = updateUserDto.name;
        if (updateUserDto.isAdmin !== undefined)
            user.isAdmin = updateUserDto.isAdmin;
        return this.usersRepo.save(user);
    }
    async remove(id) {
        const user = await this.usersRepo.findOneBy({ id });
        if (!user)
            return null;
        await this.usersRepo.remove(user);
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(follow_entity_1.FollowEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(donation_entity_1.DonationEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(stream_subscription_entity_1.StreamSubscriptionEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(streamer_entity_1.StreamerEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
