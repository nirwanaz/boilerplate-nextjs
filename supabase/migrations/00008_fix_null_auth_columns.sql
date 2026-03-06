-- Fix: GoTrue v2 cannot scan NULL text columns into Go strings
-- Error: "Scan error on column index N, name X: converting NULL to string is unsupported"
-- Solution: Set all NULL text columns to empty strings
-- NOTE: This must be run via Supabase Dashboard SQL Editor (not migrations)
--        because the migration runner lacks auth schema permissions.
--        Included here for documentation and future db resets.

update auth.users set email_change = '' where email_change is null;
update auth.users set
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  email_change_confirm_status = coalesce(email_change_confirm_status, 0),
  phone_change = coalesce(phone_change, ''),
  phone_change_token = coalesce(phone_change_token, ''),
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  reauthentication_token = coalesce(reauthentication_token, '');
