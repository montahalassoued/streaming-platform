import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "johndoe" })
  username!: string;

  @ApiProperty({ example: "johndoe@example.com" })
  email!: string;

  @ApiProperty({ example: "hashed-password" })
  passwordHash!: string;

  @ApiPropertyOptional({ example: "John Doe" })
  name?: string;
}
