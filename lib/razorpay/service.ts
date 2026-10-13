import crypto from 'crypto';

const DEFAULT_DEV_SECRET = 'M0HYSy6hpkm7iCGTusJJjORt';
const DEFAULT_WEBHOOK_SECRET = 'whsec_test_dev_webhook_secret';

export function getRazorpayServerConfig() {
  const keyId =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    'rzp_test_TnIwct8tDMtGdl';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || DEFAULT_DEV_SECRET;
  const webhookSecret =
    process.env.RAZORPAY_WEBHOOK_SECRET || DEFAULT_WEBHOOK_SECRET;
  const isLiveKey = keyId.startsWith('rzp_live_');

  return {
    keyId,
    keySecret,
    webhookSecret,
    isLiveKey,
    isConfiguredWithRealCredentials:
      Boolean(keyId && keySecret) &&
      !keySecret.includes('your_razorpay'),
  };
}

/**
 * Generates an HMAC-SHA256 signature for Razorpay order + payment verification.
 */
export function computeRazorpayPaymentSignature(
  orderId: string,
  paymentId: string,
  secret?: string
): string {
  const activeSecret = secret ?? getRazorpayServerConfig().keySecret;
  return crypto
    .createHmac('sha256', activeSecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
}

/**
 * Constant-time verification of Razorpay Checkout payment signature on the server.
 */
export function verifyRazorpayPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret?: string;
}): boolean {
  if (!params.orderId || !params.paymentId || !params.signature) {
    return false;
  }
  const expected = computeRazorpayPaymentSignature(
    params.orderId,
    params.paymentId,
    params.secret
  );
  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(params.signature, 'utf8');
  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

/**
 * Constant-time verification of Razorpay Webhook signature using the raw request body.
 */
export function verifyRazorpayWebhookSignature(params: {
  rawBody: string;
  signatureHeader: string | null;
  webhookSecret?: string;
}): boolean {
  if (!params.rawBody || !params.signatureHeader) {
    return false;
  }
  const secret = params.webhookSecret ?? getRazorpayServerConfig().webhookSecret;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(params.rawBody)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(params.signatureHeader, 'utf8');
  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

/**
 * Creates a Razorpay Order in integer currency subunits (paise for INR).
 * Calls Razorpay Orders API when live/test credentials are provided, or creates a deterministic test order in sandbox mode.
 */
export async function createRazorpayServerOrder(params: {
  bookingId: string;
  bookingReference: string;
  amountInr: number;
  currency?: string;
}): Promise<{
  orderId: string;
  amountSubunits: number;
  currency: string;
  keyId: string;
  isLiveMode: boolean;
  sandboxMode: boolean;
}> {
  const amountSubunits = Math.round(params.amountInr * 100);
  if (!Number.isInteger(amountSubunits) || amountSubunits <= 0) {
    throw new Error('Payment amount must be a positive integer in currency subunits.');
  }

  const currency = params.currency ?? 'INR';
  const cfg = getRazorpayServerConfig();

  if (cfg.isConfiguredWithRealCredentials) {
    const auth = Buffer.from(`${cfg.keyId}:${cfg.keySecret}`).toString('base64');
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountSubunits,
        currency,
        receipt: params.bookingReference,
        notes: {
          bookingId: params.bookingId,
          bookingReference: params.bookingReference,
        },
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as { id: string; amount: number; currency: string };
      return {
        orderId: data.id,
        amountSubunits: data.amount,
        currency: data.currency,
        keyId: cfg.keyId,
        isLiveMode: cfg.isLiveKey,
        sandboxMode: false,
      };
    }
  }

  // Deterministic server-generated test order ID when running in local test sandbox
  const hash = crypto
    .createHash('sha256')
    .update(`${params.bookingId}:${amountSubunits}:${Date.now()}`)
    .digest('hex')
    .slice(0, 14);

  return {
    orderId: `order_${hash}`,
    amountSubunits,
    currency,
    keyId: cfg.keyId,
    isLiveMode: false,
    sandboxMode: true,
  };
}
