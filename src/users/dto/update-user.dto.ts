import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "johndoe" })
  username?: string;

  @ApiPropertyOptional({ example: "johndoe@example.com" })
  email?: string;

  @ApiPropertyOptional({ example: "hashed-password" })
  passwordHash?: string;

  @ApiPropertyOptional({ example: "John Doe" })
  name?: string;

  @ApiPropertyOptional({ example: false })
  isAdmin?: boolean;
}
