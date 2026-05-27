import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateChatMessageDto } from "./dto/create-chat-message.dto";
import { UpdateChatMessageDto } from "./dto/update-chat-message.dto";
import { ChatMessageEntity } from "./entities/chat-message.entity";
import { UserEntity } from "../users/entities/user.entity";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly chatRepository: Repository<ChatMessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  async create(createChatMessageDto: CreateChatMessageDto) {
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

  async moderateMessage(messageId: string, requestingUserId: string) {
    const message = await this.chatRepository.findOneBy({ id: messageId });
    if (!message) throw new NotFoundException("Message not found");

    const requestingUser = await this.userRepository.findOneBy({
      id: requestingUserId,
    });
    if (!requestingUser) throw new NotFoundException("User not found");

    const isOwner = message.userId === requestingUserId;
    const isAdmin = requestingUser.isAdmin;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        "Only the message author or an admin can delete this message",
      );
    }

    message.isDeleted = true;
    return this.chatRepository.save(message);
  }
}
