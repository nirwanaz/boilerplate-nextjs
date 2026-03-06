-- ============================================
-- Fix: Restore supabase_auth_admin privileges
-- ============================================
-- After db reset, supabase_auth_admin may lose privileges
-- over the auth schema, causing "Database error querying schema"
-- on all login attempts.

-- Restore full privileges on auth schema for the auth admin role
grant usage on schema auth to supabase_auth_admin;
grant all on all tables in schema auth to supabase_auth_admin;
grant all on all sequences in schema auth to supabase_auth_admin;
grant all on all routines in schema auth to supabase_auth_admin;

-- Ensure the trigger function runs as superuser and doesn't interfere
-- with GoTrue's own queries
alter function public.handle_new_user() owner to postgres;

-- Grant the auth admin role access to public schema (needed for trigger)
grant usage on schema public to supabase_auth_admin;
grant all on public.profiles to supabase_auth_admin;

-- Ensure the helper functions don't block GoTrue
grant execute on function public.is_admin() to supabase_auth_admin;
grant execute on function public.has_role(text) to supabase_auth_admin;
