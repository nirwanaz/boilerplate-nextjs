-- ============================================
-- Migration: Create posts table
-- ============================================

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.posts enable row level security;

-- Anyone can read published posts
create policy "Anyone can read published posts"
  on public.posts for select
  using (status = 'published');

-- Authors can read their own posts (including drafts)
create policy "Authors can read own posts"
  on public.posts for select
  using (auth.uid() = author_id);

-- Authenticated users can create posts
create policy "Authenticated users can create posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

-- Authors can update their own posts
create policy "Authors can update own posts"
  on public.posts for update
  using (auth.uid() = author_id);

-- Authors can delete their own posts
create policy "Authors can delete own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

-- Admins can do everything with posts
create policy "Admins can manage all posts"
  on public.posts for all
  using (public.is_admin());

-- Managers can read and update all posts
create policy "Managers can read all posts"
  on public.posts for select
  using (public.has_role('manager'));

create policy "Managers can update all posts"
  on public.posts for update
  using (public.has_role('manager'));

-- Index for search
create index idx_posts_title on public.posts using gin (to_tsvector('english', title));
create index idx_posts_author on public.posts (author_id);
create index idx_posts_status on public.posts (status);
