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
exports.UpdateChatMessageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UpdateChatMessageDto {
}
exports.UpdateChatMessageDto = UpdateChatMessageDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "stream-id" }),
    __metadata("design:type", String)
], UpdateChatMessageDto.prototype, "streamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "user-id" }),
    __metadata("design:type", String)
], UpdateChatMessageDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Hello everyone" }),
    __metadata("design:type", String)
], UpdateChatMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    __metadata("design:type", Boolean)
], UpdateChatMessageDto.prototype, "isDeleted", void 0);
