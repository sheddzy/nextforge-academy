// ─── Paystack Integration ─────────────────────────────────────────────────────
// Public key is safe to expose in frontend code

export const PAYSTACK_PUBLIC_KEY = 'pk_live_2528949e9e36f7685c56ce98429cdb4457ae8d3b';

export interface PaystackConfig {
  email: string;
  amount: number; // in kobo (NGN) or lowest currency unit
  currency?: string;
  ref: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

// Generate a unique payment reference
export function generateReference(prefix = 'NFA'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Convert USD price to NGN kobo (amount * rate * 100)
// Using a fixed exchange rate — in production pull from an FX API
const USD_TO_NGN_RATE = 1600; // ₦1,600 per $1 (update as needed)

export function usdToKobo(usdAmount: number): number {
  return Math.round(usdAmount * USD_TO_NGN_RATE * 100);
}

export function usdToNgn(usdAmount: number): number {
  return Math.round(usdAmount * USD_TO_NGN_RATE);
}

export function formatNgn(kobo: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}

// Dynamically load the Paystack inline script
export function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('paystack-script')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.head.appendChild(script);
  });
}

// Open Paystack payment popup
export async function openPaystackPopup(config: PaystackConfig): Promise<void> {
  await loadPaystackScript();

  const handler = (window as any).PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: config.amount,
    currency: config.currency || 'NGN',
    ref: config.ref,
    metadata: {
      custom_fields: [
        {
          display_name: 'Platform',
          variable_name: 'platform',
          value: 'NextForge Academy',
        },
        ...(config.metadata ? Object.entries(config.metadata).map(([k, v]) => ({
          display_name: k,
          variable_name: k.toLowerCase().replace(/\s+/g, '_'),
          value: String(v),
        })) : []),
      ],
    },
    callback: (response: { reference: string }) => {
      config.onSuccess(response.reference);
    },
    onClose: () => {
      config.onClose();
    },
  });

  handler.openIframe();
}
