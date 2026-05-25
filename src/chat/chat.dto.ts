export class CreateChatMessageDto {
  streamId!: string;
  userId!: string;
  content!: string;
  isDeleted?: boolean;
}

export class UpdateChatMessageDto {
  content?: string;
  isDeleted?: boolean;
}
