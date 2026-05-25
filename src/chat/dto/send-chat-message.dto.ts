import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SendChatMessageDto {
  @ApiProperty({ example: "stream-id" })
  streamId!: string;

  @ApiProperty({ example: "Hello everyone" })
  content!: string;

  @ApiPropertyOptional({ example: "user-id" })
  userId?: string;
}
