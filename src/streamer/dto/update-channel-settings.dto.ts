import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateChannelSettingsDto {
  @ApiPropertyOptional({ example: "Welcome to my channel" })
  channelDescription?: string;

  @ApiPropertyOptional({ example: "Be kind in chat" })
  chatRules?: string;
}
