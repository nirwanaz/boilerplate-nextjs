-- ============================================
-- Seed Data for Next.js Boilerplate
-- ============================================
-- This seed creates test users via Supabase Auth,
-- which auto-triggers profile creation.
-- Then inserts sample data for all tables.
-- 
-- Default password for all test users: Password123!
-- ============================================

-- Enable pgcrypto extension for password hashing
create extension if not exists pgcrypto with schema extensions;

-- ============================================
-- 1. Create test users in auth.users
--    The on_auth_user_created trigger will auto-create profiles
--    Includes ALL GoTrue v2 required fields
-- ============================================

-- Admin user
insert into auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role,
  is_sso_user, is_anonymous,
  email_change, email_change_token_new, phone_change, phone_change_token,
  created_at, updated_at, confirmation_token, recovery_token
) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  extensions.crypt('Password123!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin User"}',
  'authenticated', 'authenticated',
  false, false,
  '', '', '', '',
  now(), now(), '', ''
) on conflict (id) do nothing;

-- Manager user
insert into auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role,
  is_sso_user, is_anonymous,
  email_change, email_change_token_new, phone_change, phone_change_token,
  created_at, updated_at, confirmation_token, recovery_token
) values (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  '00000000-0000-0000-0000-000000000000',
  'manager@example.com',
  extensions.crypt('Password123!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Manager User"}',
  'authenticated', 'authenticated',
  false, false,
  '', '', '', '',
  now(), now(), '', ''
) on conflict (id) do nothing;

-- Regular user 1
insert into auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role,
  is_sso_user, is_anonymous,
  email_change, email_change_token_new, phone_change, phone_change_token,
  created_at, updated_at, confirmation_token, recovery_token
) values (
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  '00000000-0000-0000-0000-000000000000',
  'john@example.com',
  extensions.crypt('Password123!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"John Doe"}',
  'authenticated', 'authenticated',
  false, false,
  '', '', '', '',
  now(), now(), '', ''
) on conflict (id) do nothing;

-- Regular user 2
insert into auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role,
  is_sso_user, is_anonymous,
  email_change, email_change_token_new, phone_change, phone_change_token,
  created_at, updated_at, confirmation_token, recovery_token
) values (
  'd4e5f6a7-b8c9-0123-defa-234567890123',
  '00000000-0000-0000-0000-000000000000',
  'jane@example.com',
  extensions.crypt('Password123!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Jane Smith"}',
  'authenticated', 'authenticated',
  false, false,
  '', '', '', '',
  now(), now(), '', ''
) on conflict (id) do nothing;

-- Create identities for each user (required for Supabase Auth login)
-- Includes email_verified and phone_verified in identity_data (GoTrue v2)
insert into auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  jsonb_build_object('sub', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'email', 'admin@example.com', 'email_verified', true, 'phone_verified', false),
  'email', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  now(), now(), now()
) on conflict do nothing;

insert into auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) values (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  jsonb_build_object('sub', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'email', 'manager@example.com', 'email_verified', true, 'phone_verified', false),
  'email', 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  now(), now(), now()
) on conflict do nothing;

insert into auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) values (
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  jsonb_build_object('sub', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'email', 'john@example.com', 'email_verified', true, 'phone_verified', false),
  'email', 'c3d4e5f6-a7b8-9012-cdef-123456789012',
  now(), now(), now()
) on conflict do nothing;

insert into auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) values (
  'd4e5f6a7-b8c9-0123-defa-234567890123',
  'd4e5f6a7-b8c9-0123-defa-234567890123',
  jsonb_build_object('sub', 'd4e5f6a7-b8c9-0123-defa-234567890123', 'email', 'jane@example.com', 'email_verified', true, 'phone_verified', false),
  'email', 'd4e5f6a7-b8c9-0123-defa-234567890123',
  now(), now(), now()
) on conflict do nothing;

-- ============================================
-- 2. Update profile roles
--    (profiles are auto-created by trigger with role='user')
-- ============================================
update public.profiles set role = 'admin'   where id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
update public.profiles set role = 'manager' where id = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

-- ============================================
-- 3. Create posts
-- ============================================
insert into public.posts (id, title, content, author_id, status, created_at) values
  (
    '11111111-1111-1111-1111-111111111111',
    'Getting Started with Next.js 16',
    'Next.js 16 introduces exciting new features including improved server components, enhanced caching strategies, and better developer experience. In this guide, we will walk through the key concepts and best practices for building modern web applications.',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'published',
    now() - interval '7 days'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Understanding Supabase Row Level Security',
    'Row Level Security (RLS) is a powerful feature in PostgreSQL that allows you to control access to rows in a table based on the user executing a query. Supabase makes this easy to configure and manage through policies.',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'published',
    now() - interval '5 days'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Building a Payment System with Stripe',
    'Learn how to integrate Stripe into your Next.js application for handling payments, subscriptions, and webhooks. This comprehensive guide covers everything from setup to production deployment.',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'published',
    now() - interval '3 days'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Draft: Advanced TypeScript Patterns',
    'This is a draft post about advanced TypeScript patterns including discriminated unions, template literal types, and conditional types. Still working on the examples section.',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'draft',
    now() - interval '1 day'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'My First Blog Post',
    'Hello everyone! This is my first blog post on this platform. I am excited to share my thoughts about web development, JavaScript, and the modern tech stack.',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'published',
    now() - interval '2 days'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Draft: React Server Components Deep Dive',
    'An in-depth look at how React Server Components work under the hood, their benefits, and when to use them vs client components. Coming soon!',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'draft',
    now() - interval '12 hours'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'CSS Grid vs Flexbox: A Practical Guide',
    'When should you use CSS Grid and when should you use Flexbox? This guide provides practical examples and decision frameworks to help you choose the right layout tool for your project.',
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    'published',
    now() - interval '4 days'
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'Top 10 VS Code Extensions for 2026',
    'Boost your productivity with these essential VS Code extensions. From AI assistants to Git tools, these extensions will transform your development workflow.',
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    'published',
    now() - interval '6 days'
  )
on conflict (id) do nothing;

-- ============================================
-- 4. Create user settings
-- ============================================
insert into public.user_settings (user_id, theme, language, email_notifications, push_notifications) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'dark',   'en', true,  true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'light',  'en', true,  false),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'system', 'en', true,  false),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'dark',   'id', false, false)
on conflict (user_id) do nothing;

-- ============================================
-- 5. Create additional app settings
-- ============================================
insert into public.app_settings (key, value) values
  ('max_posts_per_page', '10'),
  ('allow_registration', 'true'),
  ('default_user_role', 'user'),
  ('stripe_enabled', 'true'),
  ('app_version', '1.0.0')
on conflict (key) do nothing;

-- ============================================
-- 6. Create orders and order items
-- ============================================

-- Order 1: John's paid order
insert into public.orders (id, user_id, amount, currency, status, stripe_session_id, created_at) values
  (
    'aaaa1111-aaaa-1111-aaaa-111111111111',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    4999, 'usd', 'paid',
    'cs_test_a1b2c3d4e5f6g7h8i9j0',
    now() - interval '5 days'
  )
on conflict (id) do nothing;

insert into public.order_items (order_id, name, quantity, unit_price) values
  ('aaaa1111-aaaa-1111-aaaa-111111111111', 'Pro Plan - Monthly', 1, 2999),
  ('aaaa1111-aaaa-1111-aaaa-111111111111', 'Extra Storage 10GB', 1, 2000)
on conflict do nothing;

-- Order 2: John's pending order
insert into public.orders (id, user_id, amount, currency, status, created_at) values
  (
    'aaaa2222-aaaa-2222-aaaa-222222222222',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    2999, 'usd', 'pending',
    now() - interval '1 hour'
  )
on conflict (id) do nothing;

insert into public.order_items (order_id, name, quantity, unit_price) values
  ('aaaa2222-aaaa-2222-aaaa-222222222222', 'Pro Plan - Monthly', 1, 2999)
on conflict do nothing;

-- Order 3: Jane's paid order
insert into public.orders (id, user_id, amount, currency, status, stripe_session_id, created_at) values
  (
    'bbbb1111-bbbb-1111-bbbb-111111111111',
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    9999, 'usd', 'paid',
    'cs_test_k1l2m3n4o5p6q7r8s9t0',
    now() - interval '10 days'
  )
on conflict (id) do nothing;

insert into public.order_items (order_id, name, quantity, unit_price) values
  ('bbbb1111-bbbb-1111-bbbb-111111111111', 'Enterprise Plan - Monthly', 1, 9999)
on conflict do nothing;

-- Order 4: Jane's refunded order
insert into public.orders (id, user_id, amount, currency, status, stripe_session_id, created_at) values
  (
    'bbbb2222-bbbb-2222-bbbb-222222222222',
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    2999, 'usd', 'refunded',
    'cs_test_u1v2w3x4y5z6a7b8c9d0',
    now() - interval '15 days'
  )
on conflict (id) do nothing;

insert into public.order_items (order_id, name, quantity, unit_price) values
  ('bbbb2222-bbbb-2222-bbbb-222222222222', 'Pro Plan - Monthly', 1, 2999)
on conflict do nothing;

-- Order 5: Manager's paid order
insert into public.orders (id, user_id, amount, currency, status, stripe_session_id, created_at) values
  (
    'cccc1111-cccc-1111-cccc-111111111111',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    5998, 'usd', 'paid',
    'cs_test_e1f2g3h4i5j6k7l8m9n0',
    now() - interval '8 days'
  )
on conflict (id) do nothing;

insert into public.order_items (order_id, name, quantity, unit_price) values
  ('cccc1111-cccc-1111-cccc-111111111111', 'Pro Plan - Monthly', 1, 2999),
  ('cccc1111-cccc-1111-cccc-111111111111', 'Priority Support Add-on', 1, 2999)
on conflict do nothing;

-- ============================================
-- Done! Seed data summary:
-- ============================================
-- Users:
--   admin@example.com    (role: admin)    | Password123!
--   manager@example.com  (role: manager)  | Password123!
--   john@example.com     (role: user)     | Password123!
--   jane@example.com     (role: user)     | Password123!
--
-- Posts: 8 total (6 published, 2 drafts)
-- Orders: 5 total (3 paid, 1 pending, 1 refunded)
-- App Settings: 7 entries
-- User Settings: 4 entries (one per user)
-- ============================================
