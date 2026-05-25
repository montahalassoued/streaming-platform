import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "johndoe@example.com" })
  email!: string;

  @ApiProperty({ example: "StrongPassword123!" })
  password!: string;
}
