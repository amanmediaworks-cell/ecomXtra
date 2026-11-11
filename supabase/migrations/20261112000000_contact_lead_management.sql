-- Replace this value with each authorized Supabase Auth UID before applying.
-- Add one row per admin to support independent notification read states.
create table if not exists public.contact_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default pg_catalog.now()
);

insert into public.contact_admin_users (user_id)
values ('REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid)
on conflict (user_id) do nothing;

create or replace function public.is_contact_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.contact_admin_users admin_user
    where admin_user.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_contact_admin() from public, anon;
grant execute on function public.is_contact_admin() to authenticated;

create table if not exists public.contact_leads (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  idempotency_key uuid not null unique,
  full_name text not null check (pg_catalog.length(pg_catalog.btrim(full_name)) between 2 and 100),
  phone text not null check (phone ~ '^\+?[0-9]{7,15}$'),
  email text,
  service_slug text not null,
  message text not null check (pg_catalog.length(pg_catalog.btrim(message)) between 5 and 3000),
  source text not null default 'contact_page' check (source = 'contact_page'),
  status text not null default 'new' check (status in (
    'new', 'contacted', 'follow_up_required', 'qualified', 'converted', 'closed'
  )),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  assigned_admin_id uuid references public.contact_admin_users(user_id) on delete set null,
  follow_up_at timestamptz,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  constraint contact_leads_email_check check (
    email is null or (
      pg_catalog.length(email) <= 254
      and email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    )
  )
);

create table if not exists public.admin_notifications (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  lead_id uuid not null unique references public.contact_leads(id) on delete cascade,
  notification_type text not null default 'new_contact_lead' check (notification_type = 'new_contact_lead'),
  title text not null default 'New contact enquiry',
  created_at timestamptz not null default pg_catalog.now()
);

create table if not exists public.admin_notification_reads (
  notification_id uuid not null references public.admin_notifications(id) on delete cascade,
  admin_id uuid not null references public.contact_admin_users(user_id) on delete cascade,
  read_at timestamptz not null default pg_catalog.now(),
  primary key (notification_id, admin_id)
);

create table if not exists public.contact_lead_notes (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  lead_id uuid not null references public.contact_leads(id) on delete cascade,
  admin_id uuid not null references public.contact_admin_users(user_id) on delete restrict,
  note text not null check (pg_catalog.length(pg_catalog.btrim(note)) between 1 and 4000),
  created_at timestamptz not null default pg_catalog.now()
);

create table if not exists public.contact_lead_activity (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  lead_id uuid not null references public.contact_leads(id) on delete cascade,
  admin_id uuid references public.contact_admin_users(user_id) on delete set null,
  action_type text not null check (action_type in (
    'lead_created', 'status_changed', 'priority_changed', 'follow_up_scheduled',
    'admin_note_added', 'notification_marked_read'
  )),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default pg_catalog.now()
);

create table if not exists public.contact_submission_limits (
  bucket_hash text not null,
  window_start timestamptz not null,
  submission_count integer not null check (submission_count > 0),
  primary key (bucket_hash, window_start)
);

create index if not exists contact_leads_status_created_idx
  on public.contact_leads (status, created_at desc, id desc);
create index if not exists contact_leads_priority_idx
  on public.contact_leads (priority, created_at desc);
create index if not exists contact_leads_follow_up_idx
  on public.contact_leads (follow_up_at)
  where follow_up_at is not null;
create index if not exists contact_leads_phone_idx on public.contact_leads (phone);
create index if not exists contact_leads_email_idx on public.contact_leads (email) where email is not null;
create index if not exists contact_leads_service_idx on public.contact_leads (service_slug, created_at desc);
create index if not exists contact_leads_name_search_idx on public.contact_leads (pg_catalog.lower(full_name) text_pattern_ops);
create index if not exists contact_leads_email_search_idx on public.contact_leads (pg_catalog.lower(email) text_pattern_ops) where email is not null;
create index if not exists contact_leads_service_search_idx on public.contact_leads (pg_catalog.lower(service_slug) text_pattern_ops);
create index if not exists admin_notifications_created_idx
  on public.admin_notifications (created_at desc, id desc);
create index if not exists admin_notifications_lead_idx
  on public.admin_notifications (lead_id);
create index if not exists admin_notification_reads_admin_idx
  on public.admin_notification_reads (admin_id, read_at desc);
create index if not exists contact_lead_notes_lead_created_idx
  on public.contact_lead_notes (lead_id, created_at desc, id desc);
create index if not exists contact_lead_activity_lead_created_idx
  on public.contact_lead_activity (lead_id, created_at desc, id desc);

alter table public.contact_admin_users enable row level security;
alter table public.contact_leads enable row level security;
alter table public.admin_notifications enable row level security;
alter table public.admin_notification_reads enable row level security;
alter table public.contact_lead_notes enable row level security;
alter table public.contact_lead_activity enable row level security;
alter table public.contact_submission_limits enable row level security;

revoke all on public.contact_admin_users, public.contact_leads, public.admin_notifications,
  public.admin_notification_reads, public.contact_lead_notes, public.contact_lead_activity,
  public.contact_submission_limits from public, anon;
grant select on public.contact_leads to authenticated;
grant update (status, priority, follow_up_at, assigned_admin_id) on public.contact_leads to authenticated;
grant select on public.admin_notifications to authenticated;
grant select, insert, delete on public.admin_notification_reads to authenticated;
grant select, insert on public.contact_lead_notes to authenticated;
grant select on public.contact_lead_activity to authenticated;

create policy "Admins can read contact leads"
  on public.contact_leads for select to authenticated
  using ((select public.is_contact_admin()));
create policy "Admins can update contact leads"
  on public.contact_leads for update to authenticated
  using ((select public.is_contact_admin()))
  with check ((select public.is_contact_admin()));

create policy "Admins can read contact notifications"
  on public.admin_notifications for select to authenticated
  using ((select public.is_contact_admin()));
create policy "Admins can read their notification states"
  on public.admin_notification_reads for select to authenticated
  using (admin_id = (select auth.uid()) and (select public.is_contact_admin()));
create policy "Admins can mark their notifications read"
  on public.admin_notification_reads for insert to authenticated
  with check (admin_id = (select auth.uid()) and (select public.is_contact_admin()));
create policy "Admins can remove their notification read state"
  on public.admin_notification_reads for delete to authenticated
  using (admin_id = (select auth.uid()) and (select public.is_contact_admin()));
create policy "Admins can read contact lead notes"
  on public.contact_lead_notes for select to authenticated
  using ((select public.is_contact_admin()));
create policy "Admins can add contact lead notes"
  on public.contact_lead_notes for insert to authenticated
  with check (admin_id = (select auth.uid()) and (select public.is_contact_admin()));
create policy "Admins can read contact lead activity"
  on public.contact_lead_activity for select to authenticated
  using ((select public.is_contact_admin()));

create or replace function public.submit_contact_lead(
  p_idempotency_key uuid,
  p_full_name text,
  p_phone text,
  p_email text,
  p_service_slug text,
  p_message text
)
returns table (lead_id uuid, notification_id uuid, was_duplicate boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_lead_id uuid;
  existing_notification_id uuid;
begin
  insert into public.contact_leads (
    idempotency_key, full_name, phone, email, service_slug, message, source
  )
  values (
    p_idempotency_key, p_full_name, p_phone, p_email, p_service_slug, p_message, 'contact_page'
  )
  on conflict (idempotency_key) do nothing
  returning id into inserted_lead_id;

  if inserted_lead_id is null then
    select lead.id, notification.id
      into inserted_lead_id, existing_notification_id
    from public.contact_leads lead
    left join public.admin_notifications notification on notification.lead_id = lead.id
    where lead.idempotency_key = p_idempotency_key;

    return query select inserted_lead_id, existing_notification_id, true;
    return;
  end if;

  insert into public.admin_notifications (lead_id)
  values (inserted_lead_id)
  returning id into existing_notification_id;

  return query select inserted_lead_id, existing_notification_id, false;
end;
$$;

revoke all on function public.submit_contact_lead(uuid, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_contact_lead(uuid, text, text, text, text, text) to service_role;

create or replace function public.consume_contact_submission_limit(
  p_bucket_hash text,
  p_now timestamptz,
  p_max_submissions integer default 5
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_count integer;
  current_window timestamptz := pg_catalog.date_trunc('hour', p_now);
begin
  delete from public.contact_submission_limits
  where window_start < current_window - interval '24 hours';

  insert into public.contact_submission_limits (bucket_hash, window_start, submission_count)
  values (p_bucket_hash, current_window, 1)
  on conflict (bucket_hash, window_start)
  do update set submission_count = public.contact_submission_limits.submission_count + 1
  returning submission_count into current_count;

  return current_count <= p_max_submissions;
end;
$$;

revoke all on function public.consume_contact_submission_limit(text, timestamptz, integer) from public, anon, authenticated;
grant execute on function public.consume_contact_submission_limit(text, timestamptz, integer) to service_role;

create or replace function public.mark_all_contact_notifications_read()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  marked_count integer;
begin
  if not (select public.is_contact_admin()) then
    raise exception 'admin_access_required' using errcode = '42501';
  end if;

  insert into public.admin_notification_reads (notification_id, admin_id)
  select notification.id, (select auth.uid())
  from public.admin_notifications notification
  where not exists (
    select 1 from public.admin_notification_reads read_state
    where read_state.notification_id = notification.id
      and read_state.admin_id = (select auth.uid())
  )
  on conflict do nothing;

  get diagnostics marked_count = row_count;
  return marked_count;
end;
$$;

revoke all on function public.mark_all_contact_notifications_read() from public, anon;
grant execute on function public.mark_all_contact_notifications_read() to authenticated;

create or replace function public.get_contact_lead_metrics()
returns table (
  total_leads bigint,
  new_leads bigint,
  unread_notifications bigint,
  follow_ups_due bigint,
  qualified_leads bigint,
  converted_leads bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not (select public.is_contact_admin()) then
    raise exception 'admin_access_required' using errcode = '42501';
  end if;

  return query
  select
    (select count(*) from public.contact_leads),
    (select count(*) from public.contact_leads where status = 'new'),
    (
      select count(*)
      from public.admin_notifications notification
      where not exists (
        select 1 from public.admin_notification_reads read_state
        where read_state.notification_id = notification.id
          and read_state.admin_id = (select auth.uid())
      )
    ),
    (select count(*) from public.contact_leads where follow_up_at <= pg_catalog.now() and status not in ('converted', 'closed')),
    (select count(*) from public.contact_leads where status = 'qualified'),
    (select count(*) from public.contact_leads where status = 'converted');
end;
$$;

revoke all on function public.get_contact_lead_metrics() from public, anon;
grant execute on function public.get_contact_lead_metrics() to authenticated;

create or replace function public.get_contact_lead_records(
  p_limit integer default 10,
  p_before_created_at timestamptz default null,
  p_before_id uuid default null,
  p_notification_filter text default 'all',
  p_status text default null,
  p_priority text default null,
  p_service_slug text default null,
  p_search text default null,
  p_follow_up_due boolean default false,
  p_created_from timestamptz default null,
  p_created_to timestamptz default null
)
returns table (
  lead_id uuid,
  notification_id uuid,
  notification_created_at timestamptz,
  read_at timestamptz,
  full_name text,
  phone text,
  email text,
  service_slug text,
  message text,
  source text,
  status text,
  priority text,
  follow_up_at timestamptz,
  lead_created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not (select public.is_contact_admin()) then
    raise exception 'admin_access_required' using errcode = '42501';
  end if;
  if p_notification_filter not in ('all', 'read', 'unread') then
    raise exception 'invalid_notification_filter' using errcode = '22023';
  end if;

  return query
  select
    lead.id,
    notification.id,
    notification.created_at,
    read_state.read_at,
    lead.full_name,
    lead.phone,
    lead.email,
    lead.service_slug,
    lead.message,
    lead.source,
    lead.status,
    lead.priority,
    lead.follow_up_at,
    lead.created_at,
    lead.updated_at
  from public.admin_notifications notification
  join public.contact_leads lead on lead.id = notification.lead_id
  left join public.admin_notification_reads read_state
    on read_state.notification_id = notification.id
    and read_state.admin_id = (select auth.uid())
  where (
      p_notification_filter = 'all'
      or (p_notification_filter = 'read' and read_state.read_at is not null)
      or (p_notification_filter = 'unread' and read_state.read_at is null)
    )
    and (p_status is null or lead.status = p_status)
    and (p_priority is null or lead.priority = p_priority)
    and (p_service_slug is null or lead.service_slug = p_service_slug)
    and (
      p_search is null
      or p_search = ''
      or pg_catalog.lower(lead.full_name) like pg_catalog.lower(p_search) || '%'
      or (
        pg_catalog.regexp_replace(p_search, '[^0-9+]', '', 'g') <> ''
        and pg_catalog.strpos(lead.phone, pg_catalog.regexp_replace(p_search, '[^0-9+]', '', 'g')) > 0
      )
      or pg_catalog.lower(lead.email) like pg_catalog.lower(p_search) || '%'
      or pg_catalog.lower(lead.service_slug) like pg_catalog.lower(p_search) || '%'
    )
    and (not p_follow_up_due or (lead.follow_up_at <= pg_catalog.now() and lead.status not in ('converted', 'closed')))
    and (p_created_from is null or lead.created_at >= p_created_from)
    and (p_created_to is null or lead.created_at < p_created_to)
    and (
      p_before_created_at is null
      or (notification.created_at, notification.id) < (p_before_created_at, p_before_id)
    )
  order by notification.created_at desc, notification.id desc
  limit least(greatest(coalesce(p_limit, 10), 1), 10);
end;
$$;

revoke all on function public.get_contact_lead_records(integer, timestamptz, uuid, text, text, text, text, text, boolean, timestamptz, timestamptz) from public, anon;
grant execute on function public.get_contact_lead_records(integer, timestamptz, uuid, text, text, text, text, text, boolean, timestamptz, timestamptz) to authenticated;

create or replace function public.record_contact_lead_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.contact_lead_activity (lead_id, admin_id, action_type)
    values (new.id, (select auth.uid()), 'lead_created');
    return new;
  end if;

  if tg_op = 'UPDATE' and old.status is distinct from new.status then
    insert into public.contact_lead_activity (lead_id, admin_id, action_type, metadata)
    values (new.id, (select auth.uid()), 'status_changed', pg_catalog.jsonb_build_object('from', old.status, 'to', new.status));
  end if;
  if tg_op = 'UPDATE' and old.priority is distinct from new.priority then
    insert into public.contact_lead_activity (lead_id, admin_id, action_type, metadata)
    values (new.id, (select auth.uid()), 'priority_changed', pg_catalog.jsonb_build_object('from', old.priority, 'to', new.priority));
  end if;
  if tg_op = 'UPDATE' and old.follow_up_at is distinct from new.follow_up_at and new.follow_up_at is not null then
    insert into public.contact_lead_activity (lead_id, admin_id, action_type, metadata)
    values (new.id, (select auth.uid()), 'follow_up_scheduled', pg_catalog.jsonb_build_object('follow_up_at', new.follow_up_at));
  end if;
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

create trigger contact_lead_activity_trigger
  before insert or update on public.contact_leads
  for each row execute function public.record_contact_lead_activity();

create or replace function public.record_contact_notification_read()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.contact_lead_activity (lead_id, admin_id, action_type)
  select notification.lead_id, new.admin_id, 'notification_marked_read'
  from public.admin_notifications notification
  where notification.id = new.notification_id;
  return new;
end;
$$;

create trigger contact_notification_read_activity_trigger
  after insert on public.admin_notification_reads
  for each row execute function public.record_contact_notification_read();

create or replace function public.record_contact_note_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.contact_lead_activity (lead_id, admin_id, action_type)
  values (new.lead_id, new.admin_id, 'admin_note_added');
  return new;
end;
$$;

create trigger contact_note_activity_trigger
  after insert on public.contact_lead_notes
  for each row execute function public.record_contact_note_activity();

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'admin_notifications'
  ) then
    alter publication supabase_realtime add table public.admin_notifications;
  end if;
end;
$$;
