import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JoinStreamDto } from "./dto/join-stream.dto";
import { LeaveStreamDto } from "./dto/leave-stream.dto";
import { SendChatMessageDto } from "./dto/send-chat-message.dto";

@ApiTags("chat")
@Controller("chat")
export class ChatDocsController {
  @Get("docs")
  @ApiOperation({ summary: "WebSocket events contract for chat" })
  @ApiResponse({ status: 200, description: "WebSocket events and DTOs" })
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
}
