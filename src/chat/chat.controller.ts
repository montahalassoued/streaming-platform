import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { CreateChatMessageDto } from "./dto/create-chat-message.dto";
import { UpdateChatMessageDto } from "./dto/update-chat-message.dto";
import { ChatMessageEntity } from "./entities/chat-message.entity";

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
  @ApiOperation({ summary: "Update a chat message" })
  @ApiResponse({
    status: 200,
    description: "Updated message result",
  })
  update(
    @Param("id") id: string,
    @Body() updateChatMessageDto: UpdateChatMessageDto,
  ) {
    return this.chatService.update(id, updateChatMessageDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a chat message" })
  @ApiResponse({ status: 200, description: "Delete result" })
  remove(@Param("id") id: string) {
    return this.chatService.remove(id);
  }
}
