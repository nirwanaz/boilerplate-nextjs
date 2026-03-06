-- ============================================
-- Migration: Create products table
-- ============================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price integer not null, -- in cents
  currency text not null default 'usd',
  status text not null default 'active' check (status in ('active', 'inactive')),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.products enable row level security;

-- Anyone can read active products
create policy "Anyone can read active products"
  on public.products for select
  using (status = 'active');

-- Admins can read all products (including inactive)
create policy "Admins can read all products"
  on public.products for select
  using (public.is_admin());

-- Admins can create products
create policy "Admins can create products"
  on public.products for insert
  with check (public.is_admin());

-- Admins can update products
create policy "Admins can update products"
  on public.products for update
  using (public.is_admin());

-- Admins can delete products
create policy "Admins can delete products"
  on public.products for delete
  using (public.is_admin());

-- Indexes
create index idx_products_status on public.products (status);
create index idx_products_name on public.products using gin (to_tsvector('english', name));
