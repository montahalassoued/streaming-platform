import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { StreamsService } from "../streams/streams.service";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { JoinStreamDto } from "./dto/join-stream.dto";
import { LeaveStreamDto } from "./dto/leave-stream.dto";
import { SendChatMessageDto } from "./dto/send-chat-message.dto";

@WebSocketGateway({ namespace: "/chat", cors: { origin: "*" } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly streamsService: StreamsService,
    private readonly redisService: RedisService,
  ) {}

  afterInit() {
    this.logger.log("Chat websocket gateway initialized");
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("joinStream")
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinStreamDto,
  ) {
    const stream = this.streamsService.findOne(payload.streamId);
    if (!stream) {
      client.emit("chat:error", { message: "Stream not found" });
      return { ok: false };
    }

    const room = this.getRoomName(payload.streamId);
    client.join(room);
    client.data.streamId = payload.streamId;
    client.data.userId = payload.userId ?? client.data.userId;
    client.data.username = payload.username ?? client.data.username ?? null;

    const messages = this.chatService.findByStreamId(payload.streamId);
    const viewerCount = this.redisService.incrementViewerCount(
      payload.streamId,
    );

    client.emit("joinedStream", {
      streamId: payload.streamId,
      messages,
    });

    client.to(room).emit("userJoined", {
      streamId: payload.streamId,
      userId: client.data.userId ?? payload.userId ?? null,
      username: client.data.username ?? payload.username ?? null,
    });

    void viewerCount.then((count) => {
      this.server
        .to(room)
        .emit("viewerCount", { streamId: payload.streamId, count });
    });

    return { ok: true };
  }

  @SubscribeMessage("leaveStream")
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LeaveStreamDto,
  ) {
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
      userId: payload.userId ?? client.data.userId ?? null,
      username: client.data.username ?? null,
    });

    return { ok: true };
  }

  @SubscribeMessage("sendMessage")
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendChatMessageDto,
  ) {
    const room = this.getRoomName(payload.streamId);
    const userId = payload.userId ?? client.data.userId;
    const username = client.data.username ?? null;

    if (!userId) {
      client.emit("chat:error", { message: "User identity is required" });
      return { ok: false };
    }

    const message = this.chatService.create({
      streamId: payload.streamId,
      userId,
      content: payload.content,
    });

    this.server.to(room).emit("newMessage", {
      message,
      user: {
        id: userId,
        username,
      },
    });

    return message;
  }

  private getRoomName(streamId: string) {
    return `stream:${streamId}`;
  }
}
