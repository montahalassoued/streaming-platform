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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const chat_service_1 = require("./chat.service");
const create_chat_message_dto_1 = require("./dto/create-chat-message.dto");
const update_chat_message_dto_1 = require("./dto/update-chat-message.dto");
const moderate_message_dto_1 = require("./dto/moderate-message.dto");
const chat_message_entity_1 = require("./entities/chat-message.entity");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    findAll() {
        return this.chatService.findAll();
    }
    findOne(id) {
        return this.chatService.findOne(id);
    }
    create(createChatMessageDto) {
        return this.chatService.create(createChatMessageDto);
    }
    update(id, updateChatMessageDto) {
        return this.chatService.update(id, updateChatMessageDto);
    }
    moderate(id, _dto, req) {
        return this.chatService.moderateMessage(id, req.user.id);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all chat messages" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of chat messages",
        schema: {
            type: "array",
            items: { $ref: (0, swagger_1.getSchemaPath)(chat_message_entity_1.ChatMessageEntity) },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a chat message by id" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Chat message",
        type: chat_message_entity_1.ChatMessageEntity,
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a chat message" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Created message",
        type: chat_message_entity_1.ChatMessageEntity,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_message_dto_1.CreateChatMessageDto]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Update a chat message" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Updated message result" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_chat_message_dto_1.UpdateChatMessageDto]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Moderate (soft-delete) a chat message" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Message moderated" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Not the author or admin" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, moderate_message_dto_1.ModerateMessageDto, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "moderate", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)("chat"),
    (0, swagger_1.ApiExtraModels)(chat_message_entity_1.ChatMessageEntity, create_chat_message_dto_1.CreateChatMessageDto, update_chat_message_dto_1.UpdateChatMessageDto),
    (0, common_1.Controller)("chat"),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
