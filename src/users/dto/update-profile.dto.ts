import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: "John Doe" })
  name?: string;
}
