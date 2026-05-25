import { ApiProperty } from "@nestjs/swagger";

export class EmailVerificationDto {
  @ApiProperty({ example: "verification-token-here" })
  token!: string;
}
