import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LeaveStreamDto {
  @ApiProperty({ example: "stream-id" })
  streamId!: string;

  @ApiPropertyOptional({ example: "user-id" })
  userId?: string;
}
