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
exports.StreamsController = void 0;
const common_1 = require("@nestjs/common");
const streams_service_1 = require("./streams.service");
const create_stream_dto_1 = require("./dto/create-stream.dto");
const update_stream_dto_1 = require("./dto/update-stream.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let StreamsController = class StreamsController {
    constructor(streamsService) {
        this.streamsService = streamsService;
    }
    findAll(categoryId, page, limit) {
        const p = page ? Number(page) : 1;
        const l = limit ? Number(limit) : 20;
        return this.streamsService.getLiveStreams(categoryId, p, l);
    }
    findOne(id) {
        return this.streamsService.getStreamById(id);
    }
    create(user, createStreamDto) {
        return this.streamsService.createStream(user.id, createStreamDto);
    }
    update(id, user, updateStreamDto) {
        return this.streamsService.updateStream(id, user.id, updateStreamDto);
    }
    remove(id) {
        return this.streamsService.remove(id);
    }
    getKey(user) {
        return this.streamsService.getStreamKey(user.id);
    }
    verifyKey(key) {
        return this.streamsService.verifyStreamKey(key);
    }
    endByKey(key) {
        return this.streamsService.onStreamEnded(key);
    }
};
exports.StreamsController = StreamsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("categoryId")),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StreamsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StreamsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_stream_dto_1.CreateStreamDto]),
    __metadata("design:returntype", void 0)
], StreamsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_stream_dto_1.UpdateStreamDto]),
    __metadata("design:returntype", void 0)
], StreamsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StreamsController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/my/key"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StreamsController.prototype, "getKey", null);
__decorate([
    (0, common_1.Post)("/verify-key/:key"),
    __param(0, (0, common_1.Param)("key")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StreamsController.prototype, "verifyKey", null);
__decorate([
    (0, common_1.Post)("/ended/:key"),
    __param(0, (0, common_1.Param)("key")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StreamsController.prototype, "endByKey", null);
exports.StreamsController = StreamsController = __decorate([
    (0, common_1.Controller)("streams"),
    __metadata("design:paramtypes", [streams_service_1.StreamsService])
], StreamsController);
