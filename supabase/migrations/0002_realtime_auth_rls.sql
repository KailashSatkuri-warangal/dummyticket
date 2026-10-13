-- ============================================================================
-- 0002 — REALTIME AUTH & FULL RLS ENABLEMENT
-- Run in Supabase SQL Editor after 0001_initial_schema.sql
-- ============================================================================
-- 1. Auto-create profile + role + notification preferences on signup
-- 2. INSERT / ownership policies so authenticated users can persist their
--    bookings, payments, documents, and notifications
-- 3. Relax flight_offer_id foreign keys so bookings can reference offers from
--    the inventory engine (stable text ids) instead of UUID rows
-- 4. Public read access to active coupons for checkout validation
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Signup trigger: profiles + user_roles + notification_preferences
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. Booking ownership helper
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.owns_booking(check_booking_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = check_booking_id AND b.user_id = auth.uid()
  );
$$;

-- Role lookup for the current user (user_roles has no direct SELECT policy)
CREATE OR REPLACE FUNCTION public.get_my_roles()
RETURNS TEXT[]
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(array_agg(role::text), '{}')
  FROM public.user_roles
  WHERE user_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.get_my_roles() TO authenticated;

-- Bookings -------------------------------------------------------------------
DROP POLICY IF EXISTS "Users insert own bookings" ON bookings;
CREATE POLICY "Users insert own bookings" ON bookings
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

DROP POLICY IF EXISTS "Users update own bookings" ON bookings;
CREATE POLICY "Users update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Fare snapshots -------------------------------------------------------------
DROP POLICY IF EXISTS "Users insert fare snapshots" ON fare_snapshots;
CREATE POLICY "Users insert fare snapshots" ON fare_snapshots
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Users read fare snapshots" ON fare_snapshots;
CREATE POLICY "Users read fare snapshots" ON fare_snapshots
  FOR SELECT USING (auth.uid() IS NOT NULL OR is_admin(auth.uid()));

-- Booking passengers / segments ----------------------------------------------
DROP POLICY IF EXISTS "Users insert own passengers" ON booking_passengers;
CREATE POLICY "Users insert own passengers" ON booking_passengers
  FOR INSERT WITH CHECK (public.owns_booking(booking_id));

DROP POLICY IF EXISTS "Users insert own segments" ON booking_segments;
CREATE POLICY "Users insert own segments" ON booking_segments
  FOR INSERT WITH CHECK (public.owns_booking(booking_id));

-- Payments / receipts / tickets ----------------------------------------------
DROP POLICY IF EXISTS "Users insert own payments" ON payments;
CREATE POLICY "Users insert own payments" ON payments
  FOR INSERT WITH CHECK (public.owns_booking(booking_id));
DROP POLICY IF EXISTS "Users update own payments" ON payments;
CREATE POLICY "Users update own payments" ON payments
  FOR UPDATE USING (public.owns_booking(booking_id) OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users insert own receipts" ON receipts;
CREATE POLICY "Users insert own receipts" ON receipts
  FOR INSERT WITH CHECK (public.owns_booking(booking_id));

DROP POLICY IF EXISTS "Users insert own tickets" ON tickets;
CREATE POLICY "Users insert own tickets" ON tickets
  FOR INSERT WITH CHECK (public.owns_booking(booking_id));
DROP POLICY IF EXISTS "Users update own tickets" ON tickets;
CREATE POLICY "Users update own tickets" ON tickets
  FOR UPDATE USING (public.owns_booking(booking_id) OR is_admin(auth.uid()));

-- Notifications ---------------------------------------------------------------
DROP POLICY IF EXISTS "Users insert own notifications" ON notifications;
CREATE POLICY "Users insert own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Coupons ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read active coupons" ON coupons;
CREATE POLICY "Public read active coupons" ON coupons
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Users insert own coupon redemptions" ON coupon_redemptions;
CREATE POLICY "Users insert own coupon redemptions" ON coupon_redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Support requests ------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can submit support requests" ON support_requests;
CREATE POLICY "Anyone can submit support requests" ON support_requests
  FOR INSERT WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Users read own support requests" ON support_requests;
CREATE POLICY "Users read own support requests" ON support_requests
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Audit logs (system + admin write, admin read) --------------------------------
DROP POLICY IF EXISTS "Authenticated insert audit logs" ON audit_logs;
CREATE POLICY "Authenticated insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Email logs -------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated insert email logs" ON email_logs;
CREATE POLICY "Authenticated insert email logs" ON email_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Admins read email logs" ON email_logs;
CREATE POLICY "Admins read email logs" ON email_logs
  FOR SELECT USING (is_admin(auth.uid()));

-- Idempotency keys ---------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated manage idempotency keys" ON idempotency_keys;
CREATE POLICY "Authenticated manage idempotency keys" ON idempotency_keys
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Refunds -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users read own refunds" ON refunds;
CREATE POLICY "Users read own refunds" ON refunds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id AND (b.user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );
DROP POLICY IF EXISTS "Users create own refunds" ON refunds;
CREATE POLICY "Users create own refunds" ON refunds
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id AND b.user_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "Admins manage refunds" ON refunds;
CREATE POLICY "Admins manage refunds" ON refunds
  FOR ALL USING (public.is_admin(auth.uid()));

-- User roles (admin directory view) -------------------------------------------------
DROP POLICY IF EXISTS "Admins read all user roles" ON user_roles;
CREATE POLICY "Admins read all user roles" ON user_roles
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Notifications (admin console visibility) -----------------------------------------
DROP POLICY IF EXISTS "Admins read all notifications" ON notifications;
CREATE POLICY "Admins read all notifications" ON notifications
  FOR SELECT USING (public.is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins update all notifications" ON notifications;
CREATE POLICY "Admins update all notifications" ON notifications
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Email logs (customer visibility of their own lifecycle emails) --------------------
DROP POLICY IF EXISTS "Users read booking email logs" ON email_logs;
CREATE POLICY "Users read booking email logs" ON email_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id AND b.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- 3. Relax engine-offer foreign keys (inventory engine uses stable text ids)
--    The FK constraints must be dropped first: Postgres cannot convert a
--    uuid column to text while it references flight_offers(id), which stays
--    uuid ("incompatible types: text and uuid").
-- ----------------------------------------------------------------------------
ALTER TABLE fare_snapshots DROP CONSTRAINT IF EXISTS fare_snapshots_flight_offer_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_flight_offer_id_fkey;

ALTER TABLE fare_snapshots ALTER COLUMN flight_offer_id DROP DEFAULT;
ALTER TABLE fare_snapshots ALTER COLUMN flight_offer_id TYPE TEXT;
ALTER TABLE fare_snapshots ALTER COLUMN flight_offer_id SET DEFAULT '';

ALTER TABLE bookings ALTER COLUMN flight_offer_id DROP DEFAULT;
ALTER TABLE bookings ALTER COLUMN flight_offer_id TYPE TEXT;
ALTER TABLE bookings ALTER COLUMN flight_offer_id SET DEFAULT '';

-- ----------------------------------------------------------------------------
-- 4. Document defaults aligned with live issuance
-- ----------------------------------------------------------------------------
ALTER TABLE tickets ALTER COLUMN is_sample_document SET DEFAULT FALSE;
ALTER TABLE tickets ALTER COLUMN watermark_text SET DEFAULT 'CONFIRMED ITINERARY';

-- ----------------------------------------------------------------------------
-- 5. Live-provider inventory is the only operating mode
-- ----------------------------------------------------------------------------
ALTER TABLE fare_snapshots ALTER COLUMN inventory_mode SET DEFAULT 'live_provider';
ALTER TABLE flight_offers ALTER COLUMN inventory_mode SET DEFAULT 'live_provider';
ALTER TABLE bookings ALTER COLUMN fulfillment_mode SET DEFAULT 'live_provider';
