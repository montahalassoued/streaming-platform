import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({ example: "reset-token-here" })
  token!: string;

  @ApiProperty({ example: "NewStrongPassword123!" })
  password!: string;
}
