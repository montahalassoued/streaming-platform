import { IsIn, IsString } from "class-validator";

export class DonationWebhookDto {
  @IsString()
  providerPaymentId!: string;

  @IsString()
  @IsIn(["payment.succeeded", "payment.failed", "payment.refunded"])
  event!: string;
}
