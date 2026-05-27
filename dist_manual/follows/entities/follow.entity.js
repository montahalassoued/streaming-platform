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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let FollowEntity = class FollowEntity {
};
exports.FollowEntity = FollowEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "follower_id", type: "uuid" }),
    __metadata("design:type", String)
], FollowEntity.prototype, "followerId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "streamer_id", type: "uuid" }),
    __metadata("design:type", String)
], FollowEntity.prototype, "streamerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "follower_id" }),
    __metadata("design:type", user_entity_1.UserEntity)
], FollowEntity.prototype, "follower", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "streamer_id" }),
    __metadata("design:type", user_entity_1.UserEntity)
], FollowEntity.prototype, "streamer", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp" }),
    __metadata("design:type", Date)
], FollowEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: "deleted_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Object)
], FollowEntity.prototype, "deletedAt", void 0);
exports.FollowEntity = FollowEntity = __decorate([
    (0, typeorm_1.Index)("follows_streamer_id_idx", ["streamerId"]),
    (0, typeorm_1.Entity)({ name: "follows" })
], FollowEntity);
