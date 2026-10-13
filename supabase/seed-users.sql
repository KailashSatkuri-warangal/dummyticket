-- ============================================================================
-- DUMMYTICKET — SEED USERS FOR EVERY ROLE (run in Supabase SQL Editor)
-- Prerequisites: 0001_initial_schema.sql, then 0002_realtime_auth_rls.sql
--   (0002 creates the signup trigger, profiles policies, and get_my_roles()
--    RPC that the app needs for admin checks)
-- Safe to re-run at any time — every step is idempotent, and step 2b
-- backfills profiles/roles if earlier steps ever ran out of order.
--
-- !!! DEVELOPMENT / TESTING ACCOUNTS ONLY !!!
-- These accounts have known passwords. DELETE them before going to
-- production (removal block at the bottom of this file).
-- ============================================================================
-- Email                        | Password          | Role(s)
-- admin@dummyticket.test       | Admin@2026!Secure | admin
-- support@dummyticket.test     | Support@2026!X    | support_agent
-- finance@dummyticket.test     | Finance@2026!X    | finance_manager
-- editor@dummyticket.test      | Editor@2026!X     | content_editor
-- customer@dummyticket.test    | Customer@2026!X   | customer
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Auth users (email_confirmed_at = now() => can log in immediately,
--    no confirmation email needed)
-- ----------------------------------------------------------------------------
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new
) VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated', 'authenticated',
    'admin@dummyticket.test',
    crypt('Admin@2026!Secure', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Site Administrator"}',
    NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated', 'authenticated',
    'support@dummyticket.test',
    crypt('Support@2026!X', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Priya Sharma"}',
    NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated', 'authenticated',
    'finance@dummyticket.test',
    crypt('Finance@2026!X', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Rahul Verma"}',
    NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '44444444-4444-4444-4444-444444444444',
    'authenticated', 'authenticated',
    'editor@dummyticket.test',
    crypt('Editor@2026!X', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Ananya Iyer"}',
    NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '55555555-5555-5555-5555-555555555555',
    'authenticated', 'authenticated',
    'customer@dummyticket.test',
    crypt('Customer@2026!X', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Arjun Mehta"}',
    NOW(), NOW(), '', '', '', ''
  )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. Auth identities (required for the email provider to recognize logins)
--    Supplies both `provider` and `provider_id` (some projects require both).
-- ----------------------------------------------------------------------------
INSERT INTO auth.identities (
  id, user_id, provider, provider_id, identity_data, last_sign_in_at, created_at, updated_at
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'email',
    'email',
    '{"sub":"11111111-1111-1111-1111-111111111111","email":"admin@dummyticket.test"}',
    NOW(), NOW(), NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'email',
    'email',
    '{"sub":"22222222-2222-2222-2222-222222222222","email":"support@dummyticket.test"}',
    NOW(), NOW(), NOW()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    'email',
    'email',
    '{"sub":"33333333-3333-3333-3333-333333333333","email":"finance@dummyticket.test"}',
    NOW(), NOW(), NOW()
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    'email',
    'email',
    '{"sub":"44444444-4444-4444-4444-444444444444","email":"editor@dummyticket.test"}',
    NOW(), NOW(), NOW()
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '55555555-5555-5555-5555-555555555555',
    'email',
    'email',
    '{"sub":"55555555-5555-5555-5555-555555555555","email":"customer@dummyticket.test"}',
    NOW(), NOW(), NOW()
  )
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2b. Backfill safety net — if this seed (or a manual auth.users insert) ran
--     before migration 0002's signup trigger existed, the public.profiles,
--     notification_preferences, and user_roles rows are missing. Create them
--     now so role grants below always find their profile.
-- ----------------------------------------------------------------------------
INSERT INTO public.profiles (id, email, full_name)
SELECT u.id, u.email,
       COALESCE(NULLIF(u.raw_user_meta_data ->> 'full_name', ''), split_part(u.email, '@', 1))
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email LIKE '%@dummyticket.test' AND p.id IS NULL;

INSERT INTO public.notification_preferences (user_id)
SELECT p.id
FROM public.profiles p
LEFT JOIN public.notification_preferences np ON np.user_id = p.id
WHERE p.email LIKE '%@dummyticket.test' AND np.user_id IS NULL;

INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'customer'::app_role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.id
WHERE p.email = 'customer@dummyticket.test' AND ur.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. Grant staff roles (every user already received 'customer' from the
--    0002 signup trigger; remove it from staff so the role directory is clean)
-- ----------------------------------------------------------------------------
INSERT INTO public.user_roles (user_id, role, assigned_by)
SELECT p.id, r.role_name,
       (SELECT id FROM public.profiles WHERE email = 'admin@dummyticket.test')
FROM (VALUES
  ('admin@dummyticket.test',    'admin'::app_role),
  ('support@dummyticket.test',  'support_agent'::app_role),
  ('finance@dummyticket.test',  'finance_manager'::app_role),
  ('editor@dummyticket.test',   'content_editor'::app_role)
) AS r(email, role_name)
JOIN public.profiles p ON p.email = r.email
ON CONFLICT (user_id, role) DO NOTHING;

DELETE FROM public.user_roles
WHERE role = 'customer'
  AND user_id IN (
    SELECT id FROM public.profiles
    WHERE email IN (
      'admin@dummyticket.test',
      'support@dummyticket.test',
      'finance@dummyticket.test',
      'editor@dummyticket.test'
    )
  );

-- ----------------------------------------------------------------------------
-- 4. Verify — should list each email with its role(s)
-- ----------------------------------------------------------------------------
SELECT p.email, array_agg(ur.role::text ORDER BY ur.role) AS roles
FROM public.profiles p
JOIN public.user_roles ur ON ur.user_id = p.id
WHERE p.email LIKE '%@dummyticket.test'
GROUP BY p.email
ORDER BY p.email;

-- ============================================================================
-- TO REMOVE ALL SAMPLE ACCOUNTS LATER:
-- DELETE FROM auth.users WHERE email LIKE '%@dummyticket.test';
-- (profiles / roles / preferences cascade automatically)
-- ============================================================================
