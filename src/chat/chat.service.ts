import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateChatMessageDto } from "./dto/create-chat-message.dto";
import { UpdateChatMessageDto } from "./dto/update-chat-message.dto";
import { ChatMessageEntity } from "./entities/chat-message.entity";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly chatRepository: Repository<ChatMessageEntity>,
  ) {}

  findAll() {
    return this.chatRepository.find();
  }

  findOne(id: string) {
    return this.chatRepository.findOneBy({ id });
  }

  findByStreamId(streamId: string) {
    return this.chatRepository.findBy({ streamId });
  }

  create(createChatMessageDto: CreateChatMessageDto) {
    const message = this.chatRepository.create({
      streamId: createChatMessageDto.streamId,
      userId: createChatMessageDto.userId,
      content: createChatMessageDto.content,
      isDeleted: createChatMessageDto.isDeleted ?? false,
    });

    return this.chatRepository.save(message);
  }

  update(id: string, updateChatMessageDto: UpdateChatMessageDto) {
    return this.chatRepository.update(id, updateChatMessageDto);
  }

  remove(id: string) {
    return this.chatRepository.delete(id);
  }
}
