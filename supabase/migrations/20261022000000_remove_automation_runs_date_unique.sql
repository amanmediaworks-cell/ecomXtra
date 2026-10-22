-- Migration: remove unique constraint on automation_runs(scheduled_date)
-- Allows multiple cron runs to be triggered manually on the same date.

alter table public.automation_runs
  drop constraint if exists automation_runs_scheduled_date_key;

drop index if exists public.automation_runs_scheduled_date_key;
drop index if exists public.automation_runs_scheduled_date_unique_idx;

create index if not exists automation_runs_scheduled_date_idx
  on public.automation_runs (scheduled_date);

create index if not exists automation_runs_status_started_at_idx
  on public.automation_runs (status, started_at);

-- Replace claim_daily_blog_run to allow multiple runs per date
drop function if exists public.claim_daily_blog_run(date, text);

create function public.claim_daily_blog_run(
  p_scheduled_date date,
  p_category text
)
returns table (run_id uuid, attempt_token uuid)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return query
  insert into public.automation_runs as current_run (
    scheduled_date,
    status,
    category,
    started_at,
    attempt_count,
    attempt_token
  )
  values (
    p_scheduled_date,
    'running',
    p_category,
    pg_catalog.clock_timestamp(),
    1,
    pg_catalog.gen_random_uuid()
  )
  returning current_run.id, current_run.attempt_token;
end;
$$;

revoke all on function public.claim_daily_blog_run(date, text) from public, anon, authenticated;
grant execute on function public.claim_daily_blog_run(date, text) to service_role;
