export class CreateChatMessageDto {
  streamId!: string;
  userId!: string;
  content!: string;
  isDeleted?: boolean;
}
