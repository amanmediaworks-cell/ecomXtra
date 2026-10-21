-- Migration: add error_reason column to automation_runs
-- Stores a human-readable description of why a run failed,
-- in addition to the short error_code already stored.

alter table public.automation_runs
  add column if not exists error_reason text;

-- Replace fail_daily_blog_run to also accept and persist the new error_reason.
drop function if exists public.fail_daily_blog_run(uuid, uuid, text);
drop function if exists public.fail_daily_blog_run(uuid, uuid, text, text);

create function public.fail_daily_blog_run(
  p_run_id       uuid,
  p_attempt_token uuid,
  p_error_code   text,
  p_error_reason text default null
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  updated_rows integer;
begin
  update public.automation_runs
     set status       = 'failed',
         error_code   = left(p_error_code, 100),
         error_reason = left(p_error_reason, 1000),
         completed_at = pg_catalog.clock_timestamp()
   where id            = p_run_id
     and attempt_token = p_attempt_token
     and status        = 'running';

  get diagnostics updated_rows = row_count;
  return updated_rows = 1;
end;
$$;

revoke all on function public.fail_daily_blog_run(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.fail_daily_blog_run(uuid, uuid, text, text) to service_role;
