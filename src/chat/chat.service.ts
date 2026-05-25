import { Injectable } from "@nestjs/common";
import { CreateChatMessageDto, UpdateChatMessageDto } from "./chat.dto";

@Injectable()
export class ChatService {
  findAll() {
    return [{ message: "Chat messages list placeholder" }];
  }

  findOne(id: string) {
    return { message: "Chat message detail placeholder", id };
  }

  create(createChatMessageDto: CreateChatMessageDto) {
    return {
      message: "Chat message created placeholder",
      data: createChatMessageDto,
    };
  }

  update(id: string, updateChatMessageDto: UpdateChatMessageDto) {
    return {
      message: "Chat message updated placeholder",
      id,
      data: updateChatMessageDto,
    };
  }

  remove(id: string) {
    return { message: "Chat message removed placeholder", id };
  }
}
