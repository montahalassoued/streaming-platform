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
exports.CreateDonationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateDonationDto {
}
exports.CreateDonationDto = CreateDonationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "stream-id" }),
    __metadata("design:type", String)
], CreateDonationDto.prototype, "streamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "user-id" }),
    __metadata("design:type", String)
], CreateDonationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500 }),
    __metadata("design:type", Number)
], CreateDonationDto.prototype, "amountCents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "USD" }),
    __metadata("design:type", String)
], CreateDonationDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Great stream!" }),
    __metadata("design:type", String)
], CreateDonationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "completed" }),
    __metadata("design:type", String)
], CreateDonationDto.prototype, "status", void 0);
