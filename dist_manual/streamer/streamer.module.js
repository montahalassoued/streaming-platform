"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const streamer_service_1 = require("./streamer.service");
const streamer_controller_1 = require("./streamer.controller");
const streamer_entity_1 = require("./entities/streamer.entity");
const donation_entity_1 = require("../donations/entities/donation.entity");
const stream_entity_1 = require("../streams/entities/stream.entity");
const stream_subscription_entity_1 = require("../streams/entities/stream-subscription.entity");
const follow_entity_1 = require("../follows/entities/follow.entity");
const chat_message_entity_1 = require("../chat/entities/chat-message.entity");
const redis_module_1 = require("../redis/redis.module");
let StreamerModule = class StreamerModule {
};
exports.StreamerModule = StreamerModule;
exports.StreamerModule = StreamerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                streamer_entity_1.StreamerEntity,
                donation_entity_1.DonationEntity,
                stream_entity_1.StreamEntity,
                stream_subscription_entity_1.StreamSubscriptionEntity,
                follow_entity_1.FollowEntity,
                chat_message_entity_1.ChatMessageEntity,
            ]),
            redis_module_1.RedisModule,
        ],
        providers: [streamer_service_1.StreamerService],
        controllers: [streamer_controller_1.StreamerController],
        exports: [streamer_service_1.StreamerService],
    })
], StreamerModule);
