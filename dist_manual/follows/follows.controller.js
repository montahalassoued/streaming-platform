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
exports.FollowsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const follows_service_1 = require("./follows.service");
const create_follow_dto_1 = require("./dto/create-follow.dto");
let FollowsController = class FollowsController {
    constructor(follows) {
        this.follows = follows;
    }
    async follow(user, body) {
        return this.follows.follow(user.id, body.streamerId);
    }
    async unfollow(user, streamerId) {
        return this.follows.unfollow(user.id, streamerId);
    }
    async getFollowers(streamerId) {
        return this.follows.getFollowers(streamerId);
    }
    async getMyFollowing(user) {
        return this.follows.getFollowing(user.id);
    }
};
exports.FollowsController = FollowsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_follow_dto_1.CreateFollowDto]),
    __metadata("design:returntype", Promise)
], FollowsController.prototype, "follow", null);
__decorate([
    (0, common_1.Delete)(":streamerId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("streamerId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FollowsController.prototype, "unfollow", null);
__decorate([
    (0, common_1.Get)("/streamer/:streamerId"),
    __param(0, (0, common_1.Param)("streamerId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowsController.prototype, "getFollowers", null);
__decorate([
    (0, common_1.Get)("/me"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FollowsController.prototype, "getMyFollowing", null);
exports.FollowsController = FollowsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("follows"),
    __metadata("design:paramtypes", [follows_service_1.FollowsService])
], FollowsController);
