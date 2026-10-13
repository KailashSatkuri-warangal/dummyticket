export interface BrandConfig {
  name: string;
  tagline: string;
  legalEntityName: string;
  supportEmail: string;
  supportPhone: string;
  headquarters: string;
  appUrl: string;
  defaultCurrency: 'INR' | 'USD';
  inventoryMode: 'live_provider';
  razorpayConfigured: boolean;
  supabaseConfigured: boolean;
  resendConfigured: boolean;
}

export function getBrandConfig(): BrandConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseConfigured =
    Boolean(supabaseUrl) && !supabaseUrl.includes('your-project-id');

  const razorpayKey =
    process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '';
  const razorpayConfigured =
    Boolean(razorpayKey) && !razorpayKey.includes('placeholder');

  const resendKey = process.env.RESEND_API_KEY ?? '';
  const resendConfigured =
    Boolean(resendKey) && !resendKey.includes('placeholder');

  return {
    name: process.env.NEXT_PUBLIC_BRAND_NAME || 'DummyTicket',
    tagline: 'Your Next Journey Starts Here.',
    legalEntityName: 'DummyTicket Aviation Technologies Pvt. Ltd.',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@dummyticket.example.com',
    supportPhone: '+91 (040) 6789-1020',
    headquarters: 'HITEC City, Madhapur, Hyderabad, Telangana 500081, India',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    defaultCurrency: 'INR',
    inventoryMode: 'live_provider',
    razorpayConfigured,
    supabaseConfigured,
    resendConfigured,
  };
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatDuration(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}
