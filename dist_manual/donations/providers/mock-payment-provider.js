"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPaymentProvider = void 0;
const node_crypto_1 = require("node:crypto");
const EVENT_STATUS_MAP = {
    "payment.succeeded": "completed",
    "payment.failed": "failed",
    "payment.refunded": "refunded",
};
class MockPaymentProvider {
    async createCheckout(params) {
        const providerPaymentId = `mock_${params.donationId}`;
        const base = process.env.PAYMENT_PROVIDER_BASE_URL ?? "https://payments.example";
        return {
            providerPaymentId,
            checkoutUrl: `${base}/checkout/${providerPaymentId}`,
        };
    }
    verifyWebhookSignature(rawBody, signature) {
        const secret = process.env.PAYMENT_WEBHOOK_SECRET;
        if (!secret)
            return false;
        const expected = (0, node_crypto_1.createHmac)("sha256", secret).update(rawBody).digest("hex");
        return expected === signature;
    }
    mapEventToStatus(providerEvent) {
        return EVENT_STATUS_MAP[providerEvent] ?? null;
    }
}
exports.MockPaymentProvider = MockPaymentProvider;
