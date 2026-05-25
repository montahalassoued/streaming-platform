export class CreateDonationDto {
  streamId!: string;
  userId!: string;
  amountCents!: number;
  currency!: string;
  message?: string;
  status?: string;
}

export class UpdateDonationDto {
  amountCents?: number;
  currency?: string;
  message?: string;
  status?: string;
}
