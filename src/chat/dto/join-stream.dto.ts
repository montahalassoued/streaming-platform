import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class JoinStreamDto {
  @ApiProperty({ example: "stream-id" })
  streamId!: string;

  @ApiPropertyOptional({ example: "user-id" })
  userId?: string;

  @ApiPropertyOptional({ example: "johndoe" })
  username?: string;
}
