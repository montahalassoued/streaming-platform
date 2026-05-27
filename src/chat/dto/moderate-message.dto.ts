import { IsOptional, IsString, MaxLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ModerateMessageDto {
  @ApiPropertyOptional({ description: "Optional reason for moderation" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
