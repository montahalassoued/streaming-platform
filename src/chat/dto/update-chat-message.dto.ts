import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateChatMessageDto {
  @ApiPropertyOptional({ example: "stream-id" })
  streamId?: string;

  @ApiPropertyOptional({ example: "user-id" })
  userId?: string;

  @ApiPropertyOptional({ example: "Hello everyone" })
  content?: string;

  @ApiPropertyOptional({ example: false })
  isDeleted?: boolean;
}
