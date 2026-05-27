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
exports.VodEntity = void 0;
const typeorm_1 = require("typeorm");
const stream_entity_1 = require("../../streams/entities/stream.entity");
let VodEntity = class VodEntity {
};
exports.VodEntity = VodEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], VodEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "stream_id", type: "uuid" }),
    __metadata("design:type", String)
], VodEntity.prototype, "streamId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stream_entity_1.StreamEntity, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "stream_id" }),
    __metadata("design:type", stream_entity_1.StreamEntity)
], VodEntity.prototype, "stream", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], VodEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "video_url", type: "varchar" }),
    __metadata("design:type", String)
], VodEntity.prototype, "videoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "thumbnail_url", type: "varchar", nullable: true }),
    __metadata("design:type", Object)
], VodEntity.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "duration_seconds", type: "integer" }),
    __metadata("design:type", Number)
], VodEntity.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_public", type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], VodEntity.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp" }),
    __metadata("design:type", Date)
], VodEntity.prototype, "createdAt", void 0);
exports.VodEntity = VodEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "vods" })
], VodEntity);
