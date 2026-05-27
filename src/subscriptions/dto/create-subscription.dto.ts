import { IsUUID, IsOptional } from "class-validator";

export class CreateSubscriptionDto {
  @IsUUID()
  streamerId!: string;

  @IsOptional()
  @IsUUID()
  tierId?: string;
}
