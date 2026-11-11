-- Replace the admin UID placeholder with the UUID already authorized by the
-- existing blog_posts and site_content write policies before applying.
create table if not exists public.blog_topic_queue (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  primary_keyword text not null check (pg_catalog.length(pg_catalog.btrim(primary_keyword)) between 2 and 160),
  marketplace text not null,
  search_intent text not null check (search_intent in (
    'commercial_service',
    'seller_problem',
    'seller_education',
    'navigational',
    'consumer_irrelevant',
    'ambiguous'
  )),
  target_audience text not null,
  content_type text not null,
  proposed_title text not null,
  secondary_keywords text[] not null default array[]::text[],
  existing_competing_page text,
  target_internal_url text not null,
  priority smallint not null default 3 check (priority between 1 and 5),
  evidence_source text not null,
  status text not null default 'proposed' check (status in (
    'proposed',
    'approved',
    'generating',
    'generated',
    'needs_review',
    'published',
    'rejected',
    'update_existing'
  )),
  last_reviewed_at timestamptz,
  claimed_run_id uuid references public.automation_runs(id) on delete set null,
  claimed_at timestamptz,
  generated_post_id text,
  created_at timestamptz not null default pg_catalog.clock_timestamp(),
  updated_at timestamptz not null default pg_catalog.clock_timestamp(),
  constraint blog_topic_queue_target_url_check
    check (target_internal_url ~ '^https://ecomxtra[.]in/services/[a-z0-9-]+$'),
  constraint blog_topic_queue_competing_url_check
    check (
      existing_competing_page is null
      or existing_competing_page ~ '^https://ecomxtra[.]in/(services|blog)/[a-z0-9-]+$'
    )
);

create unique index if not exists blog_topic_queue_primary_keyword_unique_idx
  on public.blog_topic_queue (pg_catalog.lower(pg_catalog.btrim(primary_keyword)));

create index if not exists blog_topic_queue_approved_priority_idx
  on public.blog_topic_queue (priority desc, created_at asc)
  where status = 'approved';

alter table public.blog_topic_queue enable row level security;
revoke all on table public.blog_topic_queue from public, anon;
grant select, insert, update, delete on table public.blog_topic_queue to authenticated;
grant select, insert, update on table public.blog_topic_queue to service_role;

drop policy if exists "blog_topic_queue_admin_select" on public.blog_topic_queue;
create policy "blog_topic_queue_admin_select"
  on public.blog_topic_queue
  for select
  to authenticated
  using (auth.uid() = 'REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid);

drop policy if exists "blog_topic_queue_admin_insert" on public.blog_topic_queue;
create policy "blog_topic_queue_admin_insert"
  on public.blog_topic_queue
  for insert
  to authenticated
  with check (auth.uid() = 'REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid);

drop policy if exists "blog_topic_queue_admin_update" on public.blog_topic_queue;
create policy "blog_topic_queue_admin_update"
  on public.blog_topic_queue
  for update
  to authenticated
  using (auth.uid() = 'REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid)
  with check (auth.uid() = 'REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid);

drop policy if exists "blog_topic_queue_admin_delete" on public.blog_topic_queue;
create policy "blog_topic_queue_admin_delete"
  on public.blog_topic_queue
  for delete
  to authenticated
  using (auth.uid() = 'REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid);

create or replace function public.set_blog_topic_queue_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.clock_timestamp();
  return new;
end;
$$;

drop trigger if exists blog_topic_queue_updated_at on public.blog_topic_queue;
create trigger blog_topic_queue_updated_at
  before update on public.blog_topic_queue
  for each row execute function public.set_blog_topic_queue_updated_at();

create or replace function public.claim_approved_blog_topic(
  p_run_id uuid,
  p_attempt_token uuid
)
returns setof public.blog_topic_queue
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_run public.automation_runs%rowtype;
  selected_topic public.blog_topic_queue%rowtype;
begin
  select *
    into current_run
    from public.automation_runs
   where id = p_run_id
   for update;

  if not found
     or current_run.status <> 'running'
     or current_run.attempt_token is distinct from p_attempt_token
     or current_run.started_at <= pg_catalog.clock_timestamp() - interval '10 minutes' then
    raise exception 'Automation attempt is not active';
  end if;

  select *
    into selected_topic
    from public.blog_topic_queue
   where status = 'approved'
      or (
        status = 'generating'
        and claimed_at <= pg_catalog.clock_timestamp() - interval '10 minutes'
      )
   order by priority desc, created_at asc
   limit 1
   for update skip locked;

  if not found then
    return;
  end if;

  update public.blog_topic_queue
     set status = 'generating',
         claimed_run_id = p_run_id,
         claimed_at = pg_catalog.clock_timestamp()
   where id = selected_topic.id
   returning * into selected_topic;

  update public.automation_runs
     set category = selected_topic.marketplace,
         topic = selected_topic.primary_keyword
   where id = p_run_id
     and attempt_token = p_attempt_token
     and status = 'running';

  return next selected_topic;
end;
$$;

create or replace function public.publish_daily_blog_post_from_topic(
  p_run_id uuid,
  p_attempt_token uuid,
  p_topic_id uuid,
  p_post jsonb
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  selected_topic public.blog_topic_queue%rowtype;
  inserted_post_id text;
begin
  select *
    into selected_topic
    from public.blog_topic_queue
   where id = p_topic_id
     and claimed_run_id = p_run_id
     and status = 'generating'
   for update;

  if not found then
    raise exception 'Approved topic is not claimed by this automation run';
  end if;

  if p_post->>'category' is distinct from selected_topic.marketplace then
    raise exception 'Post category does not match the approved topic';
  end if;

  inserted_post_id := public.publish_daily_blog_post(p_run_id, p_attempt_token, p_post);

  update public.blog_topic_queue
     set status = 'published',
         generated_post_id = inserted_post_id,
         claimed_at = null,
         last_reviewed_at = pg_catalog.clock_timestamp()
   where id = p_topic_id
     and claimed_run_id = p_run_id
     and status = 'generating';

  if not found then
    raise exception 'Approved topic changed during publication';
  end if;

  return inserted_post_id;
end;
$$;

create or replace function public.fail_daily_blog_run(
  p_run_id uuid,
  p_attempt_token uuid,
  p_error_code text,
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
     set status = 'failed',
         error_code = pg_catalog.left(p_error_code, 100),
         error_reason = p_error_reason,
         completed_at = pg_catalog.clock_timestamp()
   where id = p_run_id
     and attempt_token = p_attempt_token
     and status = 'running';

  get diagnostics updated_rows = row_count;
  if updated_rows <> 1 then
    return false;
  end if;

  update public.blog_topic_queue
     set status = 'approved',
         claimed_run_id = null,
         claimed_at = null
   where claimed_run_id = p_run_id
     and status = 'generating';

  return true;
end;
$$;

revoke all on function public.set_blog_topic_queue_updated_at() from public, anon, authenticated;
revoke all on function public.claim_approved_blog_topic(uuid, uuid) from public, anon, authenticated;
revoke all on function public.publish_daily_blog_post_from_topic(uuid, uuid, uuid, jsonb) from public, anon, authenticated;
revoke all on function public.fail_daily_blog_run(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.claim_approved_blog_topic(uuid, uuid) to service_role;
grant execute on function public.publish_daily_blog_post_from_topic(uuid, uuid, uuid, jsonb) to service_role;
grant execute on function public.fail_daily_blog_run(uuid, uuid, text, text) to service_role;

insert into public.blog_topic_queue (
  primary_keyword,
  marketplace,
  search_intent,
  target_audience,
  content_type,
  proposed_title,
  secondary_keywords,
  existing_competing_page,
  target_internal_url,
  priority,
  evidence_source,
  status,
  last_reviewed_at
)
values
  (
    'flipkart seller central',
    'Flipkart',
    'navigational',
    'Existing Flipkart sellers seeking account operations support',
    'Refresh existing article; do not create a login guide',
    'Flipkart Seller Central Support for Indian Marketplace Sellers',
    array['Flipkart account management', 'Flipkart seller support'],
    'https://ecomxtra.in/blog/mastering-flipkart-seller-central-a-guide-to-professional-account-management',
    'https://ecomxtra.in/services/flipkart-account-management',
    1,
    'Google Search Console Queries.csv: 543 impressions, 0 clicks, average position 6.47 (28-day Web report); matching Pages.csv article: 618 impressions, 0 clicks, average position 6.93. Navigational intent; avoid login intent.',
    'update_existing',
    pg_catalog.clock_timestamp()
  ),
  (
    'amazon account management services',
    'Amazon',
    'commercial_service',
    'Indian brands and sellers seeking recurring Amazon account operations support',
    'Improve existing service page',
    'Amazon Account Management Services for Indian Sellers',
    array['Amazon account management services in India', 'Amazon seller account support'],
    'https://ecomxtra.in/services/amazon-account-management',
    'https://ecomxtra.in/services/amazon-account-management',
    5,
    'Google Search Console Queries.csv: 22 impressions, 0 clicks, average position 55.95; matching Pages.csv service page: 64 impressions, 0 clicks, average position 35.95. Volume and difficulty are unverified.',
    'update_existing',
    pg_catalog.clock_timestamp()
  ),
  (
    'how to optimize product listings on marketplaces',
    'Amazon',
    'seller_education',
    'Indian marketplace sellers improving existing product catalogues',
    'Refresh existing article and add relevant service links',
    'How to Optimize Marketplace Product Listings for Indian Sellers',
    array['marketplace product listing optimization', 'marketplace catalogue management'],
    'https://ecomxtra.in/blog/mastering-marketplace-product-listing-optimization-for-better-sales',
    'https://ecomxtra.in/services/amazon-account-management',
    4,
    'Google Search Console Queries.csv: 38 impressions, 0 clicks, average position 8.97; matching Pages.csv article: 80 impressions, 0 clicks, average position 10.97. Volume and difficulty are unverified.',
    'update_existing',
    pg_catalog.clock_timestamp()
  ),
  (
    'flipkart onboarding services',
    'Flipkart',
    'commercial_service',
    'Indian brands preparing to onboard or launch on Flipkart',
    'Improve onboarding service page and supporting guide',
    'Flipkart Seller Onboarding Services: Preparation and Support',
    array['Flipkart seller onboarding', 'Flipkart onboarding process'],
    'https://ecomxtra.in/blog/mastering-flipkart-seller-onboarding-a-complete-guide-to-launching-successfully',
    'https://ecomxtra.in/services/flipkart-account-management',
    3,
    'Google Search Console Queries.csv: 5 impressions, 0 clicks, average position 20.20; matching Pages.csv article: 91 impressions, 2 clicks, average position 11.01. Volume and difficulty are unverified.',
    'update_existing',
    pg_catalog.clock_timestamp()
  ),
  (
    'marketplace inventory management',
    'Amazon',
    'seller_problem',
    'Indian sellers managing inventory across marketplace accounts',
    'Refresh existing article with practical inventory workflows',
    'Marketplace Inventory Management for Indian Sellers',
    array['how to manage inventory on a marketplace', 'inventory sync across marketplaces India'],
    'https://ecomxtra.in/blog/mastering-marketplace-inventory-management-scaling-operations-for-indian-sellers',
    'https://ecomxtra.in/services/amazon-account-management',
    2,
    'Google Search Console Queries.csv: 4 impressions, 0 clicks, average position 5.25; matching Pages.csv article: 31 impressions, 1 click, average position 12.42. Very small sample; volume and difficulty are unverified.',
    'update_existing',
    pg_catalog.clock_timestamp()
  ),
  (
    'blinkit account management',
    'Blinkit',
    'commercial_service',
    'Indian brands and eligible partners seeking ongoing Blinkit operations support',
    'Improve existing service page',
    'Blinkit Account Management Support for Brands',
    array['Blinkit account management services', 'Blinkit seller support'],
    'https://ecomxtra.in/services/blinkit-account-management',
    'https://ecomxtra.in/services/blinkit-account-management',
    3,
    'Google Search Console Queries.csv: 1 click, 5 impressions, average position 41.60; matching Pages.csv service page: 2 clicks, 40 impressions, average position 16.57. Very small sample; volume and difficulty are unverified.',
    'update_existing',
    pg_catalog.clock_timestamp()
  ),
  (
    'zepto account management',
    'Zepto',
    'commercial_service',
    'Indian brands and eligible partners seeking ongoing Zepto operations support',
    'Improve existing service page',
    'Zepto Account Management Support for Brands',
    array['Zepto account management services', 'Zepto partner operations'],
    'https://ecomxtra.in/services/zepto-account-management',
    'https://ecomxtra.in/services/zepto-account-management',
    3,
    'Google Search Console Queries.csv: 10 impressions, 0 clicks, average position 28.60; matching Pages.csv service page: 30 impressions, 0 clicks, average position 16.57. Volume and difficulty are unverified.',
    'update_existing',
    pg_catalog.clock_timestamp()
  ),
  (
    'instamart account management',
    'Swiggy Instamart',
    'commercial_service',
    'Indian brands and eligible partners seeking ongoing Swiggy Instamart operations support',
    'Improve existing service page',
    'Swiggy Instamart Account Management Support for Brands',
    array['Swiggy Instamart seller account', 'Instamart account management services'],
    'https://ecomxtra.in/services/swiggy-instamart-account-management',
    'https://ecomxtra.in/services/swiggy-instamart-account-management',
    2,
    'Google Search Console Queries.csv: 7 impressions, 0 clicks, average position 29.57; matching Pages.csv service page: 43 impressions, 0 clicks, average position 16.42. Volume and difficulty are unverified.',
    'update_existing',
    pg_catalog.clock_timestamp()
  )
on conflict (pg_catalog.lower(pg_catalog.btrim(primary_keyword))) do nothing;
