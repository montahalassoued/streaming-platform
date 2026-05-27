import { createHmac } from "node:crypto";
import {
  CheckoutResult,
  CreateCheckoutParams,
  DonationStatus,
  IPaymentProvider,
} from "./payment-provider.interface";

const EVENT_STATUS_MAP: Record<string, DonationStatus> = {
  "payment.succeeded": "completed",
  "payment.failed": "failed",
  "payment.refunded": "refunded",
};

export class MockPaymentProvider implements IPaymentProvider {
  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
    const providerPaymentId = `mock_${params.donationId}`;
    const base = process.env.PAYMENT_PROVIDER_BASE_URL ?? "https://payments.example";
    return {
      providerPaymentId,
      checkoutUrl: `${base}/checkout/${providerPaymentId}`,
    };
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET;
    if (!secret) return false;
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    return expected === signature;
  }

  mapEventToStatus(providerEvent: string): DonationStatus | null {
    return EVENT_STATUS_MAP[providerEvent] ?? null;
  }
}
