-- ============================================================================
-- DUMMYTICKET — FLIGHT BOOKING & CONFIRMED ITINERARY PLATFORM
-- Deterministic Seed Data (Live Inventory & All 10 Indian Airlines)
-- ============================================================================

INSERT INTO airports (iata_code, icao_code, name, city, country, country_code, timezone) VALUES
  ('HYD', 'VOHS', 'Rajiv Gandhi International Airport', 'Hyderabad', 'India', 'IN', 'Asia/Kolkata'),
  ('DEL', 'VIDP', 'Indira Gandhi International Airport', 'New Delhi', 'India', 'IN', 'Asia/Kolkata'),
  ('BOM', 'VABB', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'India', 'IN', 'Asia/Kolkata'),
  ('BLR', 'VOBL', 'Kempegowda International Airport', 'Bengaluru', 'India', 'IN', 'Asia/Kolkata'),
  ('MAA', 'VOMM', 'Chennai International Airport', 'Chennai', 'India', 'IN', 'Asia/Kolkata'),
  ('GOX', 'VOGA', 'Manohar International Airport (Mopa)', 'Goa', 'India', 'IN', 'Asia/Kolkata'),
  ('DXB', 'OMDB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates', 'AE', 'Asia/Dubai'),
  ('SIN', 'WSSS', 'Singapore Changi Airport', 'Singapore', 'Singapore', 'SG', 'Asia/Singapore'),
  ('LHR', 'EGLL', 'Heathrow Airport', 'London', 'United Kingdom', 'GB', 'Europe/London'),
  ('MSY', 'KMSY', 'Louis Armstrong New Orleans International Airport', 'New Orleans', 'United States', 'US', 'America/Chicago'),
  ('JFK', 'KJFK', 'John F. Kennedy International Airport', 'New York', 'United States', 'US', 'America/New_York')
ON CONFLICT (iata_code) DO NOTHING;

INSERT INTO airlines (iata_code, name, country) VALUES
  ('6E', 'IndiGo', 'India'),
  ('AI', 'Air India', 'India'),
  ('IX', 'Air India Express', 'India'),
  ('QP', 'Akasa Air', 'India'),
  ('SG', 'SpiceJet', 'India'),
  ('9I', 'Alliance Air', 'India'),
  ('IC', 'Fly91', 'India'),
  ('S5', 'Star Air', 'India'),
  ('I7', 'IndiaOne Air', 'India'),
  ('Z5', 'Zoom Air', 'India'),
  ('BA', 'British Airways', 'United Kingdom'),
  ('EK', 'Emirates', 'United Arab Emirates'),
  ('SQ', 'Singapore Airlines', 'Singapore'),
  ('QR', 'Qatar Airways', 'Qatar'),
  ('LH', 'Lufthansa', 'Germany')
ON CONFLICT (iata_code) DO NOTHING;

INSERT INTO fare_rules (code, name, cabin, is_refundable, cancellation_fee_inr, change_fee_inr, cabin_baggage_kg, checked_baggage_kg, seat_selection_included, meal_included, terms_summary) VALUES
  ('ECO_SAVER', 'Economy Value Saver', 'economy', FALSE, 3500, 2500, 7, 15, FALSE, FALSE, 'Non-refundable base fare; statutory taxes refundable upon cancellation before departure.'),
  ('ECO_FLEX', 'Economy Flex Plus', 'economy', TRUE, 1200, 500, 7, 25, TRUE, TRUE, 'Partially refundable with low cancellation fee up to 24 hours before departure.'),
  ('BIZ_ELITE', 'Business Executive Flex', 'business', TRUE, 500, 0, 12, 40, TRUE, TRUE, 'Fully flexible itinerary changes and priority baggage handling included.')
ON CONFLICT (code) DO NOTHING;

INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount_inr, max_discount_inr, usage_limit, valid_until, is_active) VALUES
  ('WELCOME10', '10% off up to ₹1,500 on flight bookings', 'percentage', 10, 3000, 1500, 1000, '2027-12-31T23:59:59Z', TRUE),
  ('FLAT500', 'Flat ₹500 instant discount on domestic & international routes', 'fixed', 500, 4000, 500, 500, '2027-12-31T23:59:59Z', TRUE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO site_settings (key, value) VALUES
  ('brand', '{"name": "DummyTicket", "supportEmail": "support@dummyticket.example.com", "supportPhone": "+91-40-6789-1020", "inventoryMode": "LIVE", "itineraryServiceFeeInr": 499}'::jsonb)
ON CONFLICT (key) DO NOTHING;
