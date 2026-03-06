-- ============================================
-- Migration: Create orders and order_items tables
-- ============================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null, -- in cents
  currency text not null default 'usd',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  stripe_session_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Users can view their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Users can create orders (for themselves)
create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Service role can update order status (webhook)
create policy "Service can update orders"
  on public.orders for update
  using (true);

-- Admins can view all orders
create policy "Admins can view all orders"
  on public.orders for select
  using (public.is_admin());

-- Order Items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  name text not null,
  quantity integer not null default 1,
  unit_price integer not null, -- in cents
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

-- Users can view items of their own orders
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Users can create items for their orders
create policy "Users can create own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Admins can view all order items
create policy "Admins can view all order items"
  on public.order_items for select
  using (public.is_admin());

-- Indexes
create index idx_orders_user on public.orders (user_id);
create index idx_orders_status on public.orders (status);
create index idx_orders_stripe_session on public.orders (stripe_session_id);
create index idx_order_items_order on public.order_items (order_id);
