-- ============================================
-- Migration: Create app_settings and user_settings tables
-- ============================================

-- App Settings (key-value store for global config)
create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

-- Anyone can read app settings
create policy "Anyone can read app settings"
  on public.app_settings for select
  using (true);

-- Only admins can modify app settings
create policy "Admins can manage app settings"
  on public.app_settings for all
  using (public.is_admin());

-- Default app settings
insert into public.app_settings (key, value) values
  ('site_name', 'Next.js Boilerplate'),
  ('maintenance_mode', 'false')
on conflict (key) do nothing;

-- User Settings (per-user preferences)
create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.profiles(id) on delete cascade,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  language text not null default 'en',
  email_notifications boolean not null default true,
  push_notifications boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

-- Users can read and modify their own settings
create policy "Users can read own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);
