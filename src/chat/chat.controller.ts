import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateChatMessageDto } from "./dto/create-chat-message.dto";
import { UpdateChatMessageDto } from "./dto/update-chat-message.dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.chatService.findOne(id);
  }

  @Post()
  create(@Body() createChatMessageDto: CreateChatMessageDto) {
    return this.chatService.create(createChatMessageDto);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateChatMessageDto: UpdateChatMessageDto,
  ) {
    return this.chatService.update(id, updateChatMessageDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.chatService.remove(id);
  }
}
