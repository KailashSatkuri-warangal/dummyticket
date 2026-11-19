/**
 * Client-side LocalStorage & Cookie storage for recently generated / booked tickets.
 * Allows users on phone or desktop to access their previously generated tickets instantly.
 */

export interface SavedBookingItem {
  bookingReference: string;
  pnr?: string;
  origin?: string;
  destination?: string;
  departureDate?: string;
  passengerName?: string;
  type?: 'flight' | 'hotel';
  plan?: 'free' | 'premium';
  createdAt: string;
  pdfUrl?: string;
}

const STORAGE_KEY = 'dt_recent_bookings';

export function getRecentBookings(): SavedBookingItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }

    // Fallback: check cookie
    const cookies = document.cookie.split(';');
    for (const c of cookies) {
      const [name, val] = c.trim().split('=');
      if (name === STORAGE_KEY && val) {
        const decoded = decodeURIComponent(val);
        const parsed = JSON.parse(decoded);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return [];
}

export function saveRecentBooking(item: SavedBookingItem): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRecentBookings();
    // De-duplicate by bookingReference
    const filtered = existing.filter(
      (b) => b.bookingReference !== item.bookingReference
    );
    const updated = [item, ...filtered].slice(0, 10); // keep last 10

    const serialized = JSON.stringify(updated);
    localStorage.setItem(STORAGE_KEY, serialized);

    // Also persist in cookie with 90-day expiry
    const maxAge = 60 * 60 * 24 * 90;
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(
      serialized
    )}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch {
    // Ignore storage quota errors
  }
}

export function removeRecentBooking(reference: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRecentBookings();
    const filtered = existing.filter((b) => b.bookingReference !== reference);
    const serialized = JSON.stringify(filtered);
    localStorage.setItem(STORAGE_KEY, serialized);
    const maxAge = 60 * 60 * 24 * 90;
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(
      serialized
    )}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch {
    // Ignore storage errors
  }
}
