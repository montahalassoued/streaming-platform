import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "johndoe" })
  username!: string;

  @ApiProperty({ example: "johndoe@example.com" })
  email!: string;

  @ApiProperty({ example: "StrongPassword123!" })
  password!: string;

  @ApiPropertyOptional({ example: "John Doe" })
  name?: string;
}
