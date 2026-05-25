import { ApiProperty } from "@nestjs/swagger";

export class ResendEmailVerificationDto {
  @ApiProperty({ example: "johndoe@example.com" })
  email!: string;
}
