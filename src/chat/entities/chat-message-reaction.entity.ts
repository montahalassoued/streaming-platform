import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ChatMessageEntity } from "./chat-message.entity";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "chat_message_reactions" })
export class ChatMessageReactionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "message_id", type: "uuid" })
  messageId!: string;

  @ManyToOne(() => ChatMessageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "message_id" })
  message?: ChatMessageEntity;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user?: UserEntity;

  @Column({ type: "varchar" })
  type!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
