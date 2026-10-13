-- ============================================================================
-- DUMMYTICKET — FUTURISTIC FLIGHT BOOKING & SAMPLE TICKET PLATFORM
-- Migration: 0001_initial_schema.sql
-- Covers all 30 core tables (including receipts and email_templates), status enums, indexes, constraints, and RLS.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Enums for strict state enforcement
CREATE TYPE booking_status AS ENUM (
  'pending',
  'awaiting_payment',
  'paid_pending_confirmation',
  'confirmed',
  'ticketed',
  'cancel_requested',
  'cancelled',
  'expired',
  'failed'
);

CREATE TYPE payment_status AS ENUM (
  'created',
  'pending',
  'authorized',
  'captured',
  'failed',
  'refund_pending',
  'partially_refunded',
  'refunded'
);

CREATE TYPE ticket_document_status AS ENUM (
  'not_generated',
  'sample_generated',
  'issued',
  'voided'
);

CREATE TYPE fulfillment_mode AS ENUM (
  'sample_demo',
  'live_provider'
);

CREATE TYPE cabin_class AS ENUM (
  'economy',
  'premium_economy',
  'business',
  'first'
);

CREATE TYPE app_role AS ENUM (
  'customer',
  'support_agent',
  'finance_manager',
  'content_editor',
  'admin'
);

CREATE TYPE email_delivery_status AS ENUM (
  'queued',
  'sent',
  'delivered',
  'bounced',
  'failed'
);

-- ============================================================================
-- TABLE 1: profiles
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  preferred_currency TEXT NOT NULL DEFAULT 'INR',
  marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
  save_traveler_consent BOOLEAN NOT NULL DEFAULT FALSE,
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  deletion_requested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 2: user_roles
-- ============================================================================
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'customer',
  assigned_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Helper function for RLS admin check
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = check_user_id AND role IN ('admin', 'support_agent', 'finance_manager', 'content_editor')
  );
$$;

-- ============================================================================
-- TABLE 3: airports
-- ============================================================================
CREATE TABLE airports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  iata_code CHAR(3) NOT NULL UNIQUE,
  icao_code CHAR(4),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code CHAR(2) NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_airports_iata ON airports(iata_code);
CREATE INDEX idx_airports_city ON airports(city);

-- ============================================================================
-- TABLE 4: airlines
-- ============================================================================
CREATE TABLE airlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  iata_code VARCHAR(3) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo_url TEXT,
  country TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 5: fare_rules
-- ============================================================================
CREATE TABLE fare_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  cabin cabin_class NOT NULL DEFAULT 'economy',
  is_refundable BOOLEAN NOT NULL DEFAULT FALSE,
  cancellation_fee_inr INTEGER NOT NULL DEFAULT 3500,
  change_fee_inr INTEGER NOT NULL DEFAULT 2500,
  cabin_baggage_kg INTEGER NOT NULL DEFAULT 7,
  checked_baggage_kg INTEGER NOT NULL DEFAULT 15,
  seat_selection_included BOOLEAN NOT NULL DEFAULT FALSE,
  meal_included BOOLEAN NOT NULL DEFAULT FALSE,
  terms_summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 6: flight_offers
-- ============================================================================
CREATE TABLE flight_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_number TEXT NOT NULL,
  airline_id UUID NOT NULL REFERENCES airlines(id),
  origin_airport_id UUID NOT NULL REFERENCES airports(id),
  destination_airport_id UUID NOT NULL REFERENCES airports(id),
  origin_iata CHAR(3) NOT NULL,
  destination_iata CHAR(3) NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  stops_count INTEGER NOT NULL DEFAULT 0 CHECK (stops_count >= 0),
  layover_summary TEXT,
  cabin cabin_class NOT NULL DEFAULT 'economy',
  base_fare_inr INTEGER NOT NULL CHECK (base_fare_inr > 0),
  taxes_inr INTEGER NOT NULL CHECK (taxes_inr >= 0),
  service_fee_inr INTEGER NOT NULL DEFAULT 0 CHECK (service_fee_inr >= 0),
  seats_available INTEGER NOT NULL DEFAULT 9 CHECK (seats_available >= 0),
  fare_rule_id UUID NOT NULL REFERENCES fare_rules(id),
  inventory_mode fulfillment_mode NOT NULL DEFAULT 'sample_demo',
  provider_offer_ref TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT different_origin_destination CHECK (origin_iata <> destination_iata)
);

CREATE INDEX idx_flight_offers_route_date ON flight_offers(origin_iata, destination_iata, departure_time);

-- ============================================================================
-- TABLE 7: flight_segments
-- ============================================================================
CREATE TABLE flight_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_offer_id UUID NOT NULL REFERENCES flight_offers(id) ON DELETE CASCADE,
  segment_order INTEGER NOT NULL DEFAULT 1,
  airline_iata VARCHAR(3) NOT NULL,
  flight_number TEXT NOT NULL,
  origin_iata CHAR(3) NOT NULL,
  destination_iata CHAR(3) NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  aircraft_type TEXT DEFAULT 'Airbus A320neo',
  layover_minutes_before INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
-- TABLE 8: coupons
-- ============================================================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL CHECK (discount_value > 0),
  min_order_amount_inr INTEGER NOT NULL DEFAULT 0,
  max_discount_inr INTEGER,
  usage_limit INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 9: fare_snapshots
-- ============================================================================
CREATE TABLE fare_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_offer_id UUID NOT NULL REFERENCES flight_offers(id),
  adults INTEGER NOT NULL DEFAULT 1 CHECK (adults >= 1),
  children INTEGER NOT NULL DEFAULT 0 CHECK (children >= 0),
  infants INTEGER NOT NULL DEFAULT 0 CHECK (infants >= 0),
  cabin cabin_class NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  base_fare_total INTEGER NOT NULL,
  taxes_total INTEGER NOT NULL,
  service_fee_total INTEGER NOT NULL DEFAULT 0,
  discount_total INTEGER NOT NULL DEFAULT 0,
  grand_total INTEGER NOT NULL CHECK (grand_total > 0),
  coupon_code TEXT,
  pricing_rules_applied JSONB NOT NULL DEFAULT '[]'::jsonb,
  inventory_mode fulfillment_mode NOT NULL DEFAULT 'sample_demo',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 10: bookings
-- ============================================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference VARCHAR(24) NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  flight_offer_id UUID NOT NULL REFERENCES flight_offers(id),
  fare_snapshot_id UUID NOT NULL REFERENCES fare_snapshots(id),
  origin_iata CHAR(3) NOT NULL,
  destination_iata CHAR(3) NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  infants INTEGER NOT NULL DEFAULT 0,
  cabin cabin_class NOT NULL DEFAULT 'economy',
  currency TEXT NOT NULL DEFAULT 'INR',
  total_amount INTEGER NOT NULL CHECK (total_amount > 0),
  status booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'created',
  ticket_status ticket_document_status NOT NULL DEFAULT 'not_generated',
  fulfillment_mode fulfillment_mode NOT NULL DEFAULT 'sample_demo',
  provider_booking_ref TEXT,
  airline_pnr TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  terms_accepted_at TIMESTAMPTZ NOT NULL,
  fare_change_accepted_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================================================
-- TABLE 11: booking_passengers
-- ============================================================================
CREATE TABLE booking_passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  passenger_type TEXT NOT NULL CHECK (passenger_type IN ('adult', 'child', 'infant')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  passport_number_masked TEXT,
  passport_expiry DATE,
  nationality CHAR(2),
  ticket_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 12: booking_segments
-- ============================================================================
CREATE TABLE booking_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  segment_order INTEGER NOT NULL DEFAULT 1,
  airline_name TEXT NOT NULL,
  airline_iata VARCHAR(3) NOT NULL,
  flight_number TEXT NOT NULL,
  origin_iata CHAR(3) NOT NULL,
  destination_iata CHAR(3) NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  cabin cabin_class NOT NULL,
  baggage_cabin_kg INTEGER NOT NULL DEFAULT 7,
  baggage_checked_kg INTEGER NOT NULL DEFAULT 15
);

-- ============================================================================
-- TABLE 13: payments
-- ============================================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
  amount_subunits INTEGER NOT NULL CHECK (amount_subunits > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  status payment_status NOT NULL DEFAULT 'created',
  payment_method TEXT,
  failure_reason TEXT,
  is_live_mode BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_order_id ON payments(razorpay_order_id);

-- ============================================================================
-- TABLE 14: payment_events
-- ============================================================================
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  provider_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 15: refunds
-- ============================================================================
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  razorpay_refund_id TEXT UNIQUE,
  amount_inr INTEGER NOT NULL CHECK (amount_inr > 0),
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('requested', 'approved', 'processed', 'failed', 'rejected')),
  processed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 16: tickets
-- ============================================================================
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  document_reference TEXT NOT NULL UNIQUE,
  status ticket_document_status NOT NULL DEFAULT 'not_generated',
  is_sample_document BOOLEAN NOT NULL DEFAULT TRUE,
  watermark_text TEXT NOT NULL DEFAULT 'SAMPLE — NOT VALID FOR TRAVEL',
  airline_pnr TEXT,
  e_ticket_numbers TEXT[],
  verification_token TEXT NOT NULL,
  pdf_storage_path TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 17: receipts (Separate from Sample Itinerary Ticket Document)
-- ============================================================================
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT NOT NULL UNIQUE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT NOT NULL,
  amount_paid INTEGER NOT NULL CHECK (amount_paid > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  base_fare INTEGER NOT NULL,
  taxes INTEGER NOT NULL,
  service_fee INTEGER NOT NULL DEFAULT 0,
  discount INTEGER NOT NULL DEFAULT 0,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 18: notifications
-- ============================================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);

-- ============================================================================
-- TABLE 19: notification_preferences
-- ============================================================================
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_booking_updates BOOLEAN NOT NULL DEFAULT TRUE,
  email_payment_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  email_marketing_offers BOOLEAN NOT NULL DEFAULT FALSE,
  in_app_realtime BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 20: email_templates
-- ============================================================================
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject_template TEXT NOT NULL,
  body_html_template TEXT NOT NULL,
  body_text_template TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 21: email_logs
-- ============================================================================
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  template_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  provider_message_id TEXT,
  status email_delivery_status NOT NULL DEFAULT 'queued',
  retry_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 22: coupon_redemptions
-- ============================================================================
CREATE TABLE coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  discount_applied_inr INTEGER NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 23: reviews
-- ============================================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  is_verified_booking BOOLEAN NOT NULL DEFAULT TRUE,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 24: blog_posts
-- ============================================================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'DummyTicket Editorial Team',
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  canonical_url TEXT,
  cover_image_url TEXT,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 25: destinations
-- ============================================================================
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  airport_iata CHAR(3) NOT NULL,
  headline TEXT NOT NULL,
  overview TEXT NOT NULL,
  best_time_to_visit TEXT NOT NULL,
  visa_requirements_summary TEXT NOT NULL,
  sample_starting_fare_inr INTEGER NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 26: route_pages
-- ============================================================================
CREATE TABLE route_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  origin_iata CHAR(3) NOT NULL,
  destination_iata CHAR(3) NOT NULL,
  origin_city TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  average_duration_minutes INTEGER NOT NULL,
  airlines_operating TEXT[] NOT NULL,
  starting_sample_fare_inr INTEGER NOT NULL,
  route_guide_markdown TEXT NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 27: support_requests
-- ============================================================================
CREATE TABLE support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  booking_reference TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 28: audit_logs
-- ============================================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  before_state JSONB,
  after_state JSONB,
  correlation_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 29: site_settings
-- ============================================================================
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE 30: idempotency_keys
-- ============================================================================
CREATE TABLE idempotency_keys (
  key TEXT PRIMARY KEY,
  operation TEXT NOT NULL,
  response_status INTEGER NOT NULL,
  response_body JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE airlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE fare_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE fare_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE idempotency_keys ENABLE ROW LEVEL SECURITY;

-- Public read access for catalog & SEO tables
CREATE POLICY "Public read airports" ON airports FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read airlines" ON airlines FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read fare_rules" ON fare_rules FOR SELECT USING (TRUE);
CREATE POLICY "Public read active flight_offers" ON flight_offers FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read flight_segments" ON flight_segments FOR SELECT USING (TRUE);
CREATE POLICY "Public read published blog_posts" ON blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public read published destinations" ON destinations FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public read published route_pages" ON route_pages FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = TRUE);

-- User own-record access
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin(auth.uid()));
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users read own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));
CREATE POLICY "Users read own booking passengers" ON booking_passengers FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR is_admin(auth.uid())))
);
CREATE POLICY "Users read own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR is_admin(auth.uid())))
);
CREATE POLICY "Users read own tickets" ON tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR is_admin(auth.uid())))
);
CREATE POLICY "Users read own receipts" ON receipts FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR is_admin(auth.uid())))
);
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Admin full access policies
CREATE POLICY "Admins manage all flights" ON flight_offers FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins manage all bookings" ON bookings FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins manage email templates" ON email_templates FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins read audit logs" ON audit_logs FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins manage site settings" ON site_settings FOR ALL USING (is_admin(auth.uid()));
