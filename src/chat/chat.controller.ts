import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RequestWithUser } from "../common/types/auth.types";
import { ChatService } from "./chat.service";
import { CreateChatMessageDto } from "./dto/create-chat-message.dto";
import { UpdateChatMessageDto } from "./dto/update-chat-message.dto";
import { ModerateMessageDto } from "./dto/moderate-message.dto";
import { ChatMessageEntity } from "./entities/chat-message.entity";
import { Request } from "express";

@ApiTags("chat")
@ApiExtraModels(ChatMessageEntity, CreateChatMessageDto, UpdateChatMessageDto)
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: "Get all chat messages" })
  @ApiResponse({
    status: 200,
    description: "List of chat messages",
    schema: {
      type: "array",
      items: { $ref: getSchemaPath(ChatMessageEntity) },
    },
  })
  findAll() {
    return this.chatService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a chat message by id" })
  @ApiResponse({
    status: 200,
    description: "Chat message",
    type: ChatMessageEntity,
  })
  findOne(@Param("id") id: string) {
    return this.chatService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a chat message" })
  @ApiResponse({
    status: 201,
    description: "Created message",
    type: ChatMessageEntity,
  })
  create(@Body() createChatMessageDto: CreateChatMessageDto) {
    return this.chatService.create(createChatMessageDto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a chat message" })
  @ApiResponse({ status: 200, description: "Updated message result" })
  update(
    @Param("id") id: string,
    @Body() updateChatMessageDto: UpdateChatMessageDto,
  ) {
    return this.chatService.update(id, updateChatMessageDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Moderate (soft-delete) a chat message" })
  @ApiResponse({ status: 200, description: "Message moderated" })
  @ApiResponse({ status: 403, description: "Not the author or admin" })
  moderate(
    @Param("id") id: string,
    @Body() _dto: ModerateMessageDto,
    @Req() req: Request & RequestWithUser,
  ) {
    return this.chatService.moderateMessage(id, req.user.id);
  }
}
