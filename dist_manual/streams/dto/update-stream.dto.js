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
exports.UpdateStreamDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UpdateStreamDto {
}
exports.UpdateStreamDto = UpdateStreamDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "streamer-id" }),
    __metadata("design:type", String)
], UpdateStreamDto.prototype, "streamerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "category-id" }),
    __metadata("design:type", String)
], UpdateStreamDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Alice Live" }),
    __metadata("design:type", String)
], UpdateStreamDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "rtmp://example/live/alice" }),
    __metadata("design:type", String)
], UpdateStreamDto.prototype, "rtmpUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "https://cdn.example.com/hls/alice.m3u8" }),
    __metadata("design:type", String)
], UpdateStreamDto.prototype, "hlsUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    __metadata("design:type", Boolean)
], UpdateStreamDto.prototype, "isLive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2026-05-25T18:00:00.000Z" }),
    __metadata("design:type", String)
], UpdateStreamDto.prototype, "startedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2026-05-25T20:00:00.000Z" }),
    __metadata("design:type", String)
], UpdateStreamDto.prototype, "endedAt", void 0);
