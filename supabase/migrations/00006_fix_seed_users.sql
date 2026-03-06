-- ============================================
-- Fix: Recreate seed users with GoTrue v2 compatible fields
-- ============================================
-- The original seed data was missing required GoTrue v2 columns
-- (is_sso_user, is_anonymous), causing "Database error querying schema"
-- on login attempts.

-- Step 1: Clean up broken seed data (cascade deletes profiles, posts, etc.)
delete from auth.identities where user_id in (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'd4e5f6a7-b8c9-0123-defa-234567890123'
);
delete from auth.users where id in (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'd4e5f6a7-b8c9-0123-defa-234567890123'
);

-- Step 2: Re-insert users with all required GoTrue v2 fields
-- Admin user
insert into auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role,
  is_sso_user, is_anonymous,
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
  now(), now(), '', ''
);

-- Manager user
insert into auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role,
  is_sso_user, is_anonymous,
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
  now(), now(), '', ''
);

-- Regular user 1 (John)
insert into auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role,
  is_sso_user, is_anonymous,
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
  now(), now(), '', ''
);

-- Regular user 2 (Jane)
insert into auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role,
  is_sso_user, is_anonymous,
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
  now(), now(), '', ''
);

-- Step 3: Recreate identities
insert into auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   jsonb_build_object('sub', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'email', 'admin@example.com', 'email_verified', true, 'phone_verified', false),
   'email', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', now(), now(), now()),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
   jsonb_build_object('sub', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'email', 'manager@example.com', 'email_verified', true, 'phone_verified', false),
   'email', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', now(), now(), now()),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'c3d4e5f6-a7b8-9012-cdef-123456789012',
   jsonb_build_object('sub', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'email', 'john@example.com', 'email_verified', true, 'phone_verified', false),
   'email', 'c3d4e5f6-a7b8-9012-cdef-123456789012', now(), now(), now()),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'd4e5f6a7-b8c9-0123-defa-234567890123',
   jsonb_build_object('sub', 'd4e5f6a7-b8c9-0123-defa-234567890123', 'email', 'jane@example.com', 'email_verified', true, 'phone_verified', false),
   'email', 'd4e5f6a7-b8c9-0123-defa-234567890123', now(), now(), now());

-- Step 4: Update profile roles (profiles are auto-created by trigger)
update public.profiles set role = 'admin'   where id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
update public.profiles set role = 'manager' where id = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

-- Step 5: Recreate posts (cascade-deleted with profiles)
insert into public.posts (id, title, content, author_id, status, created_at) values
  ('11111111-1111-1111-1111-111111111111', 'Getting Started with Next.js 16',
   'Next.js 16 introduces exciting new features including improved server components, enhanced caching strategies, and better developer experience.',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'published', now() - interval '7 days'),
  ('22222222-2222-2222-2222-222222222222', 'Understanding Supabase Row Level Security',
   'Row Level Security (RLS) is a powerful feature in PostgreSQL that allows you to control access to rows in a table based on the user executing a query.',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'published', now() - interval '5 days'),
  ('33333333-3333-3333-3333-333333333333', 'Building a Payment System with Stripe',
   'Learn how to integrate Stripe into your Next.js application for handling payments, subscriptions, and webhooks.',
   'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'published', now() - interval '3 days'),
  ('44444444-4444-4444-4444-444444444444', 'Draft: Advanced TypeScript Patterns',
   'This is a draft post about advanced TypeScript patterns including discriminated unions, template literal types, and conditional types.',
   'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'draft', now() - interval '1 day'),
  ('55555555-5555-5555-5555-555555555555', 'My First Blog Post',
   'Hello everyone! This is my first blog post on this platform. I am excited to share my thoughts about web development.',
   'c3d4e5f6-a7b8-9012-cdef-123456789012', 'published', now() - interval '2 days'),
  ('66666666-6666-6666-6666-666666666666', 'Draft: React Server Components Deep Dive',
   'An in-depth look at how React Server Components work under the hood, their benefits, and when to use them vs client components.',
   'c3d4e5f6-a7b8-9012-cdef-123456789012', 'draft', now() - interval '12 hours'),
  ('77777777-7777-7777-7777-777777777777', 'CSS Grid vs Flexbox: A Practical Guide',
   'When should you use CSS Grid and when should you use Flexbox? This guide provides practical examples and decision frameworks.',
   'd4e5f6a7-b8c9-0123-defa-234567890123', 'published', now() - interval '4 days'),
  ('88888888-8888-8888-8888-888888888888', 'Top 10 VS Code Extensions for 2026',
   'Boost your productivity with these essential VS Code extensions. From AI assistants to Git tools.',
   'd4e5f6a7-b8c9-0123-defa-234567890123', 'published', now() - interval '6 days')
on conflict (id) do nothing;

-- Step 6: Recreate user settings
insert into public.user_settings (user_id, theme, language, email_notifications, push_notifications) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'dark',   'en', true,  true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'light',  'en', true,  false),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'system', 'en', true,  false),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'dark',   'id', false, false)
on conflict (user_id) do nothing;

-- Step 7: Recreate orders (cascade-deleted with profiles)
insert into public.orders (id, user_id, amount, currency, status, stripe_session_id, created_at) values
  ('aaaa1111-aaaa-1111-aaaa-111111111111', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 4999, 'usd', 'paid', 'cs_test_a1b2c3d4e5f6g7h8i9j0', now() - interval '5 days'),
  ('aaaa2222-aaaa-2222-aaaa-222222222222', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 2999, 'usd', 'pending', null, now() - interval '1 hour'),
  ('bbbb1111-bbbb-1111-bbbb-111111111111', 'd4e5f6a7-b8c9-0123-defa-234567890123', 9999, 'usd', 'paid', 'cs_test_k1l2m3n4o5p6q7r8s9t0', now() - interval '10 days'),
  ('bbbb2222-bbbb-2222-bbbb-222222222222', 'd4e5f6a7-b8c9-0123-defa-234567890123', 2999, 'usd', 'refunded', 'cs_test_u1v2w3x4y5z6a7b8c9d0', now() - interval '15 days'),
  ('cccc1111-cccc-1111-cccc-111111111111', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 5998, 'usd', 'paid', 'cs_test_e1f2g3h4i5j6k7l8m9n0', now() - interval '8 days')
on conflict (id) do nothing;

insert into public.order_items (order_id, name, quantity, unit_price) values
  ('aaaa1111-aaaa-1111-aaaa-111111111111', 'Pro Plan - Monthly', 1, 2999),
  ('aaaa1111-aaaa-1111-aaaa-111111111111', 'Extra Storage 10GB', 1, 2000),
  ('aaaa2222-aaaa-2222-aaaa-222222222222', 'Pro Plan - Monthly', 1, 2999),
  ('bbbb1111-bbbb-1111-bbbb-111111111111', 'Enterprise Plan - Monthly', 1, 9999),
  ('bbbb2222-bbbb-2222-bbbb-222222222222', 'Pro Plan - Monthly', 1, 2999),
  ('cccc1111-cccc-1111-cccc-111111111111', 'Pro Plan - Monthly', 1, 2999),
  ('cccc1111-cccc-1111-cccc-111111111111', 'Priority Support Add-on', 1, 2999)
on conflict do nothing;
