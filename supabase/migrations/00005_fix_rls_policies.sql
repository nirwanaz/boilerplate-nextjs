-- ============================================
-- Fix: Circular RLS policies on profiles table
-- ============================================

-- Step 1: Create helper functions (security definer bypasses RLS)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

create or replace function public.has_role(_role text)
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = _role
  );
$$ language sql security definer stable;

-- Step 2: Drop old circular policies on profiles
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;

-- Step 3: Recreate profiles admin policies using helper functions
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- Step 4: Drop old circular policies on posts
drop policy if exists "Admins can manage all posts" on public.posts;
drop policy if exists "Managers can read all posts" on public.posts;
drop policy if exists "Managers can update all posts" on public.posts;

-- Step 5: Recreate posts admin/manager policies using helper functions
create policy "Admins can manage all posts"
  on public.posts for all
  using (public.is_admin());

create policy "Managers can read all posts"
  on public.posts for select
  using (public.has_role('manager'));

create policy "Managers can update all posts"
  on public.posts for update
  using (public.has_role('manager'));

-- Step 6: Drop old circular policies on app_settings
drop policy if exists "Admins can manage app settings" on public.app_settings;

-- Step 7: Recreate app_settings admin policy using helper function
create policy "Admins can manage app settings"
  on public.app_settings for all
  using (public.is_admin());

-- Step 8: Drop old circular policies on orders and order_items
drop policy if exists "Admins can view all orders" on public.orders;
drop policy if exists "Admins can view all order items" on public.order_items;

-- Step 9: Recreate orders/order_items admin policies using helper functions
create policy "Admins can view all orders"
  on public.orders for select
  using (public.is_admin());

create policy "Admins can view all order items"
  on public.order_items for select
  using (public.is_admin());
