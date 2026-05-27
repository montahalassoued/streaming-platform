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
exports.ChatMessageEntity = void 0;
const typeorm_1 = require("typeorm");
const stream_entity_1 = require("../../streams/entities/stream.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let ChatMessageEntity = class ChatMessageEntity {
};
exports.ChatMessageEntity = ChatMessageEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ChatMessageEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "stream_id", type: "uuid" }),
    __metadata("design:type", String)
], ChatMessageEntity.prototype, "streamId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stream_entity_1.StreamEntity, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "stream_id" }),
    __metadata("design:type", stream_entity_1.StreamEntity)
], ChatMessageEntity.prototype, "stream", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id", type: "uuid" }),
    __metadata("design:type", String)
], ChatMessageEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.UserEntity)
], ChatMessageEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], ChatMessageEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_deleted", type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], ChatMessageEntity.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp" }),
    __metadata("design:type", Date)
], ChatMessageEntity.prototype, "createdAt", void 0);
exports.ChatMessageEntity = ChatMessageEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "chat_messages" })
], ChatMessageEntity);
