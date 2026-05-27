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
exports.ChatDocsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let ChatDocsController = class ChatDocsController {
    docs() {
        return {
            namespace: "/chat",
            events: {
                joinStream: {
                    payload: { $ref: "JoinStreamDto" },
                    example: {
                        streamId: "stream-id",
                        userId: "user-id",
                        username: "johndoe",
                    },
                },
                leaveStream: {
                    payload: { $ref: "LeaveStreamDto" },
                    example: { streamId: "stream-id", userId: "user-id" },
                },
                sendMessage: {
                    payload: { $ref: "SendChatMessageDto" },
                    example: {
                        streamId: "stream-id",
                        content: "hello",
                        userId: "user-id",
                    },
                },
            },
            emits: [
                "joinedStream",
                "userJoined",
                "userLeft",
                "viewerCount",
                "newMessage",
                "chat:error",
            ],
        };
    }
};
exports.ChatDocsController = ChatDocsController;
__decorate([
    (0, common_1.Get)("docs"),
    (0, swagger_1.ApiOperation)({ summary: "WebSocket events contract for chat" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "WebSocket events and DTOs" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatDocsController.prototype, "docs", null);
exports.ChatDocsController = ChatDocsController = __decorate([
    (0, swagger_1.ApiTags)("chat"),
    (0, common_1.Controller)("chat")
], ChatDocsController);
