export type DonationStatus = "pending" | "completed" | "failed" | "refunded";

export interface CreateCheckoutParams {
  donationId: string;
  amountCents: number;
  currency: string;
  metadata?: Record<string, string>;
}

export interface CheckoutResult {
  providerPaymentId: string;
  checkoutUrl: string;
}

export interface IPaymentProvider {
  createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult>;
  verifyWebhookSignature(rawBody: string, signature: string): boolean;
  mapEventToStatus(providerEvent: string): DonationStatus | null;
}

export const PAYMENT_PROVIDER = Symbol("PAYMENT_PROVIDER");
