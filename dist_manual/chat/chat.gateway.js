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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const redis_service_1 = require("../redis/redis.service");
const streams_service_1 = require("../streams/streams.service");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
const join_stream_dto_1 = require("./dto/join-stream.dto");
const leave_stream_dto_1 = require("./dto/leave-stream.dto");
const send_chat_message_dto_1 = require("./dto/send-chat-message.dto");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(chatService, streamsService, redisService, jwtService) {
        this.chatService = chatService;
        this.streamsService = streamsService;
        this.redisService = redisService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(ChatGateway_1.name);
    }
    afterInit(server) {
        this.logger.log("Chat websocket gateway initialized");
        server.use((socket, next) => {
            const token = socket.handshake.auth?.token ??
                socket.handshake.headers?.authorization?.replace(/^Bearer /i, "");
            if (!token) {
                return next(new Error("Unauthorized"));
            }
            try {
                const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET ?? "dev-secret" });
                socket.data.userId = payload.sub;
                socket.data.username = payload.username ?? null;
                next();
            }
            catch {
                next(new Error("Unauthorized"));
            }
        });
        if (this.redisService.isEnabled) {
            void this.redisService.subscribe("chat.system.message", (payload) => {
                try {
                    const room = this.getRoomName(payload.streamId);
                    if (this.server) {
                        this.server.to(room).emit("newMessage", {
                            message: {
                                id: `sys-${payload.streamId}-${payload.timestamp ?? "0"}`,
                                streamId: payload.streamId,
                                userId: null,
                                content: payload.content,
                                isDeleted: false,
                                createdAt: payload.timestamp ?? new Date().toISOString(),
                            },
                            user: { id: null, username: "System" },
                        });
                    }
                }
                catch (err) {
                    this.logger.error("Error broadcasting system chat message", err);
                }
            });
            void this.redisService.subscribe("chat.message.deleted", async (payload) => {
                try {
                    const messageId = payload?.messageId;
                    if (!messageId)
                        return;
                    const message = await this.chatService.findOne(messageId);
                    if (!message)
                        return;
                    const room = this.getRoomName(message.streamId);
                    this.server.to(room).emit("messageDeleted", { messageId });
                }
                catch (err) {
                    this.logger.error("Error broadcasting chat.message.deleted", err);
                }
            });
        }
    }
    handleConnection(client) {
        const token = client.handshake.auth?.token ??
            client.handshake.headers?.authorization?.replace(/^Bearer /i, "");
        if (!token) {
            this.logger.warn(`Connection rejected (no token): ${client.id}`);
            client.disconnect();
            return;
        }
        try {
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET ?? "dev-secret" });
            client.data.userId = payload.sub;
            client.data.username = payload.username ?? null;
            this.logger.log(`Client connected: ${client.id} (user ${payload.sub})`);
        }
        catch {
            this.logger.warn(`Connection rejected (invalid token): ${client.id}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleJoin(client, payload) {
        const stream = await this.streamsService.findOne(payload.streamId);
        if (!stream) {
            client.emit("chat:error", { message: "Stream not found" });
            return { ok: false };
        }
        const room = this.getRoomName(payload.streamId);
        client.join(room);
        client.data.streamId = payload.streamId;
        const messages = this.chatService.findByStreamId(payload.streamId);
        const viewerCount = this.redisService.incrementViewerCount(payload.streamId);
        client.emit("joinedStream", {
            streamId: payload.streamId,
            messages,
        });
        client.to(room).emit("userJoined", {
            streamId: payload.streamId,
            userId: client.data.userId ?? null,
            username: client.data.username ?? null,
        });
        void viewerCount.then((count) => {
            this.server
                .to(room)
                .emit("viewerCount", { streamId: payload.streamId, count });
        });
        return { ok: true };
    }
    handleLeave(client, payload) {
        const room = this.getRoomName(payload.streamId);
        client.leave(room);
        void this.redisService
            .decrementViewerCount(payload.streamId)
            .then((count) => {
            this.server
                .to(room)
                .emit("viewerCount", { streamId: payload.streamId, count });
        });
        client.to(room).emit("userLeft", {
            streamId: payload.streamId,
            userId: client.data.userId ?? null,
            username: client.data.username ?? null,
        });
        return { ok: true };
    }
    async handleMessage(client, payload) {
        const room = this.getRoomName(payload.streamId);
        const userId = client.data.userId;
        if (!userId) {
            client.emit("chat:error", { message: "User identity is required" });
            return { ok: false };
        }
        const message = await this.chatService.create({
            streamId: payload.streamId,
            userId,
            content: payload.content,
        });
        this.server.to(room).emit("newMessage", {
            message,
            user: {
                id: userId,
                username: client.data.username ?? null,
            },
        });
        return message;
    }
    getRoomName(streamId) {
        return `stream:${streamId}`;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("joinStream"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        join_stream_dto_1.JoinStreamDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leaveStream"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        leave_stream_dto_1.LeaveStreamDto]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("sendMessage"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        send_chat_message_dto_1.SendChatMessageDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: "/chat", cors: { origin: "*" } }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        streams_service_1.StreamsService,
        redis_service_1.RedisService,
        jwt_1.JwtService])
], ChatGateway);
