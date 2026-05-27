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
exports.VodsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const vods_service_1 = require("./vods.service");
const create_vod_dto_1 = require("./dto/create-vod.dto");
const update_vod_dto_1 = require("./dto/update-vod.dto");
let VodsController = class VodsController {
    constructor(vodsService) {
        this.vodsService = vodsService;
    }
    findAll() {
        return this.vodsService.findAll();
    }
    findOne(id) {
        return this.vodsService.findOne(id);
    }
    create(createVodDto) {
        return this.vodsService.create(createVodDto);
    }
    update(id, updateVodDto) {
        return this.vodsService.update(id, updateVodDto);
    }
    remove(id) {
        return this.vodsService.remove(id);
    }
};
exports.VodsController = VodsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List all public VODs" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of VODs" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VodsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a VOD by id" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "VOD detail" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "VOD not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VodsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a VOD record" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Created VOD" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vod_dto_1.CreateVodDto]),
    __metadata("design:returntype", void 0)
], VodsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Update a VOD" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Updated VOD" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_vod_dto_1.UpdateVodDto]),
    __metadata("design:returntype", void 0)
], VodsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Delete a VOD" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Deleted VOD" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VodsController.prototype, "remove", null);
exports.VodsController = VodsController = __decorate([
    (0, swagger_1.ApiTags)("vods"),
    (0, common_1.Controller)("vods"),
    __metadata("design:paramtypes", [vods_service_1.VodsService])
], VodsController);
