import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatController } from "./chat.controller";
import { ChatDocsController } from "./chat.docs.controller";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { ChatMessageEntity } from "./entities/chat-message.entity";
import { ChatMessageReactionEntity } from "./entities/chat-message-reaction.entity";
import { RedisModule } from "../redis/redis.module";
import { StreamsModule } from "../streams/streams.module";
import { UserEntity } from "../users/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessageEntity,
      ChatMessageReactionEntity,
      UserEntity,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "dev-secret",
    }),
    RedisModule,
    StreamsModule,
  ],
  controllers: [ChatController, ChatDocsController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
