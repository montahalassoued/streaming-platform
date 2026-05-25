import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateChatMessageDto {
  @ApiProperty({ example: "stream-id" })
  streamId!: string;

  @ApiProperty({ example: "user-id" })
  userId!: string;

  @ApiProperty({ example: "Hello everyone" })
  content!: string;

  @ApiPropertyOptional({ example: false })
  isDeleted?: boolean;
}
