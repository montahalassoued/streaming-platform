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
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "../redis/redis.service";
import { StreamsService } from "../streams/streams.service";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { ChatMessageWithUser } from "./chat.service";
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
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.logger.log("Chat websocket gateway initialized");

    // Reject unauthenticated connections at the handshake level so the client
    // never receives a `connect` event — only a `connect_error`.
    server.use((socket, next) => {
      const token =
        (socket.handshake.auth?.token as string | undefined) ??
        (socket.handshake.headers?.authorization as string | undefined)?.replace(
          /^Bearer /i,
          "",
        );

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      try {
        const payload = this.jwtService.verify<{
          sub: string;
          username?: string;
          isAdmin?: boolean;
        }>(token, { secret: process.env.JWT_SECRET ?? "dev-secret" });
        socket.data.userId = payload.sub;
        socket.data.username = payload.username ?? null;
        next();
      } catch {
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
        } catch (err) {
          this.logger.error(
            "Error broadcasting system chat message",
            err as any,
          );
        }
      });

      // Wire chat.message.deleted: broadcast messageDeleted to the stream room
      // so connected clients can immediately hide soft-deleted messages.
      void this.redisService.subscribe(
        "chat.message.deleted",
        async (payload) => {
          try {
            const messageId = payload?.messageId as string | undefined;
            if (!messageId) return;

            const message = await this.chatService.findOne(messageId);
            if (!message) return;

            const room = this.getRoomName(message.streamId);
            this.server.to(room).emit("messageDeleted", { messageId });
          } catch (err) {
            this.logger.error(
              "Error broadcasting chat.message.deleted",
              err as any,
            );
          }
        },
      );
    }
  }

  handleConnection(client: Socket) {
    const token =
      (client.handshake.auth?.token as string | undefined) ??
      (client.handshake.headers?.authorization as string | undefined)?.replace(
        /^Bearer /i,
        "",
      );

    if (!token) {
      this.logger.warn(`Connection rejected (no token): ${client.id}`);
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify<{
        sub: string;
        username?: string;
        isAdmin?: boolean;
      }>(token, { secret: process.env.JWT_SECRET ?? "dev-secret" });
      client.data.userId = payload.sub;
      client.data.username = payload.username ?? null;
      this.logger.log(
        `Client connected: ${client.id} (user ${payload.sub})`,
      );
    } catch {
      this.logger.warn(`Connection rejected (invalid token): ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("joinStream")
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinStreamDto,
  ) {
    const stream = await this.streamsService.findOne(payload.streamId);
    if (!stream) {
      client.emit("chat:error", { message: "Stream not found" });
      return { ok: false };
    }

    const room = this.getRoomName(payload.streamId);
    client.join(room);
    client.data.streamId = payload.streamId;

    const messages = await this.chatService.findByStreamId(payload.streamId);
    const viewerCount = this.redisService.incrementViewerCount(
      payload.streamId,
    );

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
      userId: client.data.userId ?? null,
      username: client.data.username ?? null,
    });

    return { ok: true };
  }

  @SubscribeMessage("sendMessage")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendChatMessageDto,
  ) {
    const room = this.getRoomName(payload.streamId);
    const userId = client.data.userId as string | undefined;

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

  private getRoomName(streamId: string) {
    return `stream:${streamId}`;
  }
}
