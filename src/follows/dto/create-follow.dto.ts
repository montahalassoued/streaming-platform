import { IsUUID } from "class-validator";

export class CreateFollowDto {
  @IsUUID()
  streamerId!: string;
}
