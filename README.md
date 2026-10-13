# DummyTicket — Flight Booking & Confirmed Itinerary Platform

A production-grade, responsive full-stack flight search, dynamic pricing, booking management, and boarding-pass-styled confirmed itinerary platform built with **Next.js 15 (App Router), TypeScript (strict), Tailwind CSS, Framer Motion, Supabase (PostgreSQL + Auth + RLS), Razorpay (Server-Verified Orders & Webhooks), Resend, jsPDF, and QRCode**.

---

## 1. Visual Identity & Fulfillment Model

**DummyTicket** features a custom SVG brand system (`DummyTicketLogo` integrating a geometric airplane and flight path with the letter `D`), an advanced motion design system (`framer-motion`), all **10 major and regional Indian airlines** (`IndiGo`, `Air India`, `Air India Express`, `Akasa Air`, `SpiceJet`, `Alliance Air`, `Fly91`, `Star Air`, `IndiaOne Air`, `Zoom Air`) plus international carriers (`BA`, `EK`, `SQ`, `QR`, `LH`), and a signature boarding-pass ticket design:

- **Signature Boarding Pass (`SignatureBoardingPass.tsx` & `lib/pdf/generator.ts`)**:
  - Royal blue header band (`#0062E0`), ice-blue accent stripes, crisp white boarding-pass body, airplane trajectory arc, dashed perforation line, detachable stub, barcode + QR code, and 4 interactive view modes (`Mobile Pass`, `Gate Stub`, `Desktop Airline Pass`, `PDF & Receipt Preview`).
- **Live Provider Fulfillment (`live_provider`)**:
  - Every completed booking is issued with an airline confirmation (`airlinePnr`), provider reference (`providerBookingRef`), and per-passenger e-ticket numbers.
  - Server-side guards (`validateTicketFulfillment` in `lib/booking/state-machine.ts`) ensure a booking can only transition to `ticketed` / `issued` when both `providerBookingRef` and `airlinePnr` are confirmed.
  - Booking references follow the `DT-[ORIGIN][CODE][DEST]` format; payment receipts use `DT-RCPT-...` and are always separate from the itinerary PDF.

---

## 2. Local Setup Instructions

### Prerequisites
- Node.js `v20+` (verified on `v22.15.0`)
- npm `v10+`
- Supabase project (optional for local development — a deterministic server store is active out of the box)

### Installation
```bash
npm install
cp .env.example .env.local
```

### Database Migrations & Seed Data (Supabase)
Apply the SQL schema and deterministic seed data in your Supabase SQL Editor or via the Supabase CLI:
1. Run `supabase/migrations/0001_initial_schema.sql` (creates all 30 tables including `receipts` and `email_templates`, status enums, indexes, constraints, and Row Level Security policies).
2. Run `supabase/seed.sql` (seeds Indian & international airports, all 10 Indian airlines + global carriers, fare rules, promotional coupons, and DummyTicket site settings).

### Start the Development Server
```bash
npm run dev
```
Open `http://localhost:3000`.

---

## 3. Complete Route Map

### Public Pages (25 Routes)
- `/` — Homepage (Hero with animated SVG flight path, *"Your Next Journey Starts Here."*, interactive `SignatureBoardingPass` showcase with 3 view toggles, featured HYD→MSY flights, all 10 Indian airlines showcase, popular routes, popular destinations, how it works, transparent pricing & dual-PDF preview, travel guides, FAQs, newsletter)
- `/flights` — Flight search results with `BookingStepper`, left-sidebar filters, sorting, and `AirlineLogo` cards
- `/flights/[flightId]` — Flight segment breakdown, baggage rules, fare conditions, and locked Fare Snapshot
- `/checkout/[bookingId]` — Multi-step passenger form with `BookingStepper`, passport validation, coupon codes (`WELCOME10`, `FLAT500`), fare-change revalidation banner, explicit consent, and Razorpay verification
- `/booking/[bookingId]` — Booking management, interactive `SignatureBoardingPass`, email delivery history, separate Itinerary & Receipt PDF downloads, and online cancellation
- `/payment/success` — Server-verified payment confirmation screen with 3D boarding-pass reveal and separate Receipt PDF download
- `/payment/failed` — Failed or incomplete payment retry screen
- `/ticket/[reference]` — DummyTicket Itinerary page with QR verification, airline PNR, and PDF downloads (`/sample-ticket/...` permanently redirects here)
- `/track-booking` — Booking reference lookup (`DT-HYD842MSY`, `DT-HYD319DEL`)
- `/destinations/[slug]` — Destination guides (`/destinations/dubai`, `/destinations/singapore`, `/destinations/london`, `/destinations/new-delhi`)
- `/routes/[slug]` — SEO route landing pages (`/routes/hyd-to-del`, `/routes/hyd-to-bom`, `/routes/hyd-to-blr`, `/routes/del-to-hyd`, `/routes/bom-to-dxb`, `/routes/hyd-to-sin`)
- `/blog` & `/blog/[slug]` — Editorial travel & aviation compliance articles
- `/about`, `/contact`, `/help`, `/faq`
- `/privacy-policy`, `/terms-and-conditions`, `/refund-policy`, `/cancellation-policy`, `/cookie-policy`, `/disclaimer`
- `/sitemap.xml` & `/robots.txt`

### Authenticated Customer Pages
- `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`
- `/account`, `/account/profile`, `/account/bookings`, `/account/bookings/[bookingId]`, `/account/tickets`, `/account/notifications`, `/account/security`

### Server-Protected Admin Console (18 Routes)
- `/admin`, `/admin/flights`, `/admin/airports`, `/admin/airlines`, `/admin/bookings`, `/admin/users`, `/admin/payments`, `/admin/refunds`, `/admin/pricing`, `/admin/coupons`, `/admin/notifications`, `/admin/email-templates`, `/admin/reviews`, `/admin/blog`, `/admin/seo`, `/admin/reports`, `/admin/settings`, `/admin/audit-logs`

---

## 4. API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/airports?q=...` | `GET` | Searches airports by IATA code, city, airport name, or country. |
| `/api/bookings` | `GET` / `POST` | Lists bookings or creates a pending booking with Zod validation, idempotency key deduplication, and server-side fare revalidation. |
| `/api/bookings/[bookingId]/cancel` | `POST` | Cancels a booking or initiates a refund request (`cancel_requested`) and logs an audit entry. |
| `/api/payments/create-order` | `POST` | Calculates integer currency subunits (`paise`) strictly from trusted server records and creates a Razorpay Order. |
| `/api/payments/verify` | `POST` | Verifies `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` via constant-time HMAC-SHA256 before fulfilling the booking, generating the `PaymentReceipt` (`DT-RCPT-...`), and dispatching 3 transactional emails. |
| `/api/webhooks/razorpay` | `POST` | Verifies `x-razorpay-signature` against raw request body and processes events idempotently via `x-razorpay-event-id`. |
| `/api/payments/[paymentId]/status` | `GET` | Reconciles and returns server-side payment, booking, and ticket status. |
| `/api/tickets/[reference]/pdf` | `GET` | Streams the Boarding-Pass-Styled Itinerary PDF (`application/pdf`) or the separate Payment Receipt PDF when `?type=receipt` is passed. |
| `/api/notifications` | `GET` / `PATCH` | Retrieves user-scoped notifications and marks notifications as read. |
| `/api/admin/actions` | `POST` | Role-verified admin operations (fare adjustments, refund processing, resending emails, and guarded ticket issuance). |
| `/api/support` | `POST` | Registers customer support requests and consent-verified newsletter subscriptions. |

---

## 5. Testing & Build Verification

```bash
# Run strict TypeScript verification
npm run typecheck

# Run unit and integration tests (Vitest)
npm test

# Build production bundle
npm run build

# Run end-to-end browser tests (Playwright)
npm run test:e2e
```
