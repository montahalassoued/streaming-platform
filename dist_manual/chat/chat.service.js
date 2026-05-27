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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_message_entity_1 = require("./entities/chat-message.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ChatService = class ChatService {
    constructor(chatRepository, userRepository) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }
    findAll() {
        return this.chatRepository.find();
    }
    findOne(id) {
        return this.chatRepository.findOneBy({ id });
    }
    findByStreamId(streamId) {
        return this.chatRepository.findBy({ streamId });
    }
    async create(createChatMessageDto) {
        const message = this.chatRepository.create({
            streamId: createChatMessageDto.streamId,
            userId: createChatMessageDto.userId,
            content: createChatMessageDto.content,
            isDeleted: createChatMessageDto.isDeleted ?? false,
        });
        return this.chatRepository.save(message);
    }
    update(id, updateChatMessageDto) {
        return this.chatRepository.update(id, updateChatMessageDto);
    }
    remove(id) {
        return this.chatRepository.delete(id);
    }
    async moderateMessage(messageId, requestingUserId) {
        const message = await this.chatRepository.findOneBy({ id: messageId });
        if (!message)
            throw new common_1.NotFoundException("Message not found");
        const requestingUser = await this.userRepository.findOneBy({
            id: requestingUserId,
        });
        if (!requestingUser)
            throw new common_1.NotFoundException("User not found");
        const isOwner = message.userId === requestingUserId;
        const isAdmin = requestingUser.isAdmin;
        if (!isOwner && !isAdmin) {
            throw new common_1.ForbiddenException("Only the message author or an admin can delete this message");
        }
        message.isDeleted = true;
        return this.chatRepository.save(message);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessageEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
