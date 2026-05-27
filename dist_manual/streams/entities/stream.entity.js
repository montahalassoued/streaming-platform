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
exports.StreamEntity = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../../categories/entities/category.entity");
const streamer_entity_1 = require("../../streamer/entities/streamer.entity");
let StreamEntity = class StreamEntity {
};
exports.StreamEntity = StreamEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], StreamEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "streamer_id", type: "uuid" }),
    __metadata("design:type", String)
], StreamEntity.prototype, "streamerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => streamer_entity_1.StreamerEntity, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "streamer_id" }),
    __metadata("design:type", streamer_entity_1.StreamerEntity)
], StreamEntity.prototype, "streamer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "category_id", type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], StreamEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.CategoryEntity, { nullable: true, onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "category_id" }),
    __metadata("design:type", Object)
], StreamEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], StreamEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "rtmp_url", type: "varchar" }),
    __metadata("design:type", String)
], StreamEntity.prototype, "rtmpUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "hls_url", type: "varchar" }),
    __metadata("design:type", String)
], StreamEntity.prototype, "hlsUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_live", type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], StreamEntity.prototype, "isLive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "started_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Object)
], StreamEntity.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "ended_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Object)
], StreamEntity.prototype, "endedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp" }),
    __metadata("design:type", Date)
], StreamEntity.prototype, "createdAt", void 0);
exports.StreamEntity = StreamEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "streams" })
], StreamEntity);
