import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatController } from "./chat.controller";
import { ChatDocsController } from "./chat.docs.controller";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { ChatMessageEntity } from "./entities/chat-message.entity";
import { RedisModule } from "../redis/redis.module";
import { StreamsModule } from "../streams/streams.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessageEntity]),
    RedisModule,
    StreamsModule,
  ],
  controllers: [ChatController, ChatDocsController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
