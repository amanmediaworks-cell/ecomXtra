create table if not exists public.automation_runs (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  scheduled_date date not null unique,
  status text not null check (status in ('running', 'succeeded', 'failed')),
  category text not null,
  topic text,
  post_id text,
  started_at timestamptz not null default pg_catalog.now(),
  completed_at timestamptz,
  error_code text,
  attempt_count integer not null default 1 check (attempt_count > 0),
  attempt_token uuid not null default pg_catalog.gen_random_uuid()
);

alter table public.automation_runs
  add column if not exists attempt_token uuid;

update public.automation_runs
   set attempt_token = pg_catalog.gen_random_uuid()
 where attempt_token is null;

alter table public.automation_runs
  alter column attempt_token set default pg_catalog.gen_random_uuid(),
  alter column attempt_token set not null;

create unique index if not exists automation_runs_attempt_token_unique_idx
  on public.automation_runs (attempt_token);

alter table public.blog_posts
  add column if not exists image_metadata jsonb,
  add column if not exists automation_run_id uuid
    references public.automation_runs(id) on delete set null;

do $$
declare
  missing_columns text[];
  wrong_type_columns text[];
  blog_id_type text;
  blog_id_has_default boolean;
  created_at_default text;
  created_at_generated text;
begin
  select pg_catalog.format_type(attribute.atttypid, attribute.atttypmod),
         attribute.atthasdef or attribute.attidentity <> ''
    into blog_id_type, blog_id_has_default
    from pg_catalog.pg_attribute as attribute
   where attribute.attrelid = 'public.blog_posts'::pg_catalog.regclass
     and attribute.attname = 'id'
     and attribute.attnum > 0
     and not attribute.attisdropped;

  if blog_id_type is null then
    raise exception 'public.blog_posts.id does not exist';
  end if;

  select pg_catalog.pg_get_expr(default_value.adbin, default_value.adrelid),
         attribute.attgenerated
    into created_at_default, created_at_generated
    from pg_catalog.pg_attribute as attribute
    left join pg_catalog.pg_attrdef as default_value
      on default_value.adrelid = attribute.attrelid
     and default_value.adnum = attribute.attnum
   where attribute.attrelid = 'public.blog_posts'::pg_catalog.regclass
     and attribute.attname = 'created_at'
     and attribute.attnum > 0
     and not attribute.attisdropped;

  if created_at_default is null
     and coalesce(created_at_generated, '') = '' then
    raise exception 'public.blog_posts.created_at must have a default or generated value because the publisher omits it';
  end if;

  if created_at_default ~* '^\s*null(::.*)?\s*$' then
    raise exception 'public.blog_posts.created_at has a NULL default, which is not usable';
  end if;

  if not blog_id_has_default then
    raise exception 'public.blog_posts.id (%) has no default or identity; the publisher omits id when inserting', blog_id_type;
  end if;

  select pg_catalog.array_agg(required.column_name order by required.column_name)
    into missing_columns
    from (
      values
        ('slug'),
        ('title'),
        ('category'),
        ('author'),
        ('author_role'),
        ('read_time'),
        ('cover_image'),
        ('tags'),
        ('excerpt'),
        ('content'),
        ('published_at'),
        ('created_at'),
        ('is_published'),
        ('updated_at'),
        ('seo_title'),
        ('meta_description'),
        ('social_image'),
        ('image_metadata'),
        ('automation_run_id')
    ) as required(column_name)
   where not exists (
     select 1
       from information_schema.columns as column_info
      where column_info.table_schema = 'public'
        and column_info.table_name = 'blog_posts'
        and column_info.column_name = required.column_name
   );

  if missing_columns is not null then
    raise exception 'public.blog_posts is missing required columns: %', missing_columns;
  end if;

  if not exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'blog_posts'
       and column_name = 'tags'
       and udt_name = '_text'
  ) then
    raise exception 'public.blog_posts.tags must be a PostgreSQL text[] column';
  end if;

  if not exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'blog_posts'
       and column_name = 'read_time'
       and data_type in ('text', 'character varying', 'character')
  ) then
    raise exception 'public.blog_posts.read_time must be a text-compatible column';
  end if;

  if not exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'blog_posts'
       and column_name = 'is_published'
       and data_type = 'boolean'
  ) then
    raise exception 'public.blog_posts.is_published must be boolean';
  end if;

  if not exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'blog_posts'
       and column_name = 'image_metadata'
       and data_type = 'jsonb'
  ) then
    raise exception 'public.blog_posts.image_metadata must be jsonb';
  end if;

  if not exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'blog_posts'
       and column_name = 'automation_run_id'
       and data_type = 'uuid'
  ) then
    raise exception 'public.blog_posts.automation_run_id must be uuid';
  end if;

  if exists (
    select 1
      from pg_catalog.pg_attribute as attribute
     where attribute.attrelid = 'public.blog_posts'::pg_catalog.regclass
       and attribute.attname in ('cover_image', 'social_image', 'image_metadata')
       and attribute.attnum > 0
       and not attribute.attisdropped
       and attribute.attnotnull
  ) then
    raise exception 'public.blog_posts.cover_image, social_image, and image_metadata must allow NULL for posts without a verified photo';
  end if;

  select pg_catalog.array_agg(required.column_name order by required.column_name)
    into wrong_type_columns
    from (
      values
        ('slug'),
        ('title'),
        ('category'),
        ('author'),
        ('author_role'),
        ('read_time'),
        ('cover_image'),
        ('excerpt'),
        ('content'),
        ('seo_title'),
        ('meta_description'),
        ('social_image')
    ) as required(column_name)
    join information_schema.columns as column_info
      on column_info.table_schema = 'public'
     and column_info.table_name = 'blog_posts'
     and column_info.column_name = required.column_name
   where column_info.data_type not in ('text', 'character varying', 'character');

  if wrong_type_columns is not null then
    raise exception 'public.blog_posts columns must be text-compatible: %', wrong_type_columns;
  end if;

  if exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'blog_posts'
       and column_name in ('published_at', 'created_at', 'updated_at')
       and data_type not in ('timestamp without time zone', 'timestamp with time zone')
  ) then
    raise exception 'public.blog_posts.published_at, created_at, and updated_at must be timestamp columns';
  end if;

  raise notice 'Publisher stores public.blog_posts.id (%) in automation_runs.post_id as text using id::text', blog_id_type;
end;
$$;

do $$
begin
  if exists (
    select slug
      from public.blog_posts
     where slug is not null
     group by slug
    having pg_catalog.count(*) > 1
  ) then
    raise exception 'Duplicate blog_posts.slug values exist. Resolve them before creating the unique slug index.';
  end if;
end;
$$;

create unique index if not exists blog_posts_slug_unique_idx
  on public.blog_posts (slug)
  where slug is not null;

create unique index if not exists blog_posts_automation_run_id_unique_idx
  on public.blog_posts (automation_run_id)
  where automation_run_id is not null;

alter table public.automation_runs enable row level security;
revoke all on table public.automation_runs from public, anon, authenticated;
grant usage on schema public to service_role;
grant select, insert, update on table public.automation_runs to service_role;

grant select, insert on table public.blog_posts to service_role;

do $$
declare
  id_sequence text;
begin
  id_sequence := pg_catalog.pg_get_serial_sequence('public.blog_posts', 'id');
  if id_sequence is not null then
    execute pg_catalog.format('grant usage on sequence %s to service_role', id_sequence);
  end if;
end;
$$;

drop function if exists public.claim_daily_blog_run(date, text);
drop function if exists public.publish_daily_blog_post(uuid, jsonb);
drop function if exists public.publish_daily_blog_post(uuid, uuid, jsonb);
drop function if exists public.fail_daily_blog_run(uuid, uuid, text);

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
  on conflict (scheduled_date) do update
    set status = 'running',
        category = excluded.category,
        topic = null,
        post_id = null,
        started_at = pg_catalog.clock_timestamp(),
        completed_at = null,
        error_code = null,
        attempt_count = current_run.attempt_count + 1,
        attempt_token = pg_catalog.gen_random_uuid()
    where current_run.status = 'failed'
       or (
         current_run.status = 'running'
         and current_run.started_at < pg_catalog.clock_timestamp() - interval '10 minutes'
       )
  returning current_run.id, current_run.attempt_token;
end;
$$;

create function public.publish_daily_blog_post(
  p_run_id uuid,
  p_attempt_token uuid,
  p_post jsonb
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_run public.automation_runs%rowtype;
  inserted_post_id text;
  updated_rows integer;
  required_field text;
  image_metadata_value jsonb;
begin
  select *
    into current_run
    from public.automation_runs
   where id = p_run_id
   for update;

  if not found then
    raise exception 'Automation run does not exist';
  end if;

  if current_run.attempt_token is distinct from p_attempt_token then
    raise exception 'Automation attempt token is stale';
  end if;

  if current_run.status = 'succeeded' then
    return current_run.post_id;
  end if;

  if current_run.status <> 'running'
     or current_run.started_at <= pg_catalog.clock_timestamp() - interval '10 minutes' then
    raise exception 'Automation attempt is not active';
  end if;

  if pg_catalog.jsonb_typeof(p_post) is distinct from 'object' then
    raise exception 'Post payload must be a JSON object';
  end if;

  foreach required_field in array array[
    'slug',
    'title',
    'category',
    'author',
    'author_role',
    'read_time',
    'excerpt',
    'content',
    'published_at',
    'seo_title',
    'meta_description'
  ]
  loop
    if pg_catalog.jsonb_typeof(p_post->required_field) is distinct from 'string'
       or pg_catalog.btrim(p_post->>required_field) = '' then
      raise exception 'Post payload field % must be a non-empty string', required_field;
    end if;
  end loop;

  if p_post->>'category' <> current_run.category then
    raise exception 'Post category does not match the claimed run';
  end if;

  if p_post->>'slug' !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
     or pg_catalog.length(p_post->>'slug') > 80 then
    raise exception 'Post slug is invalid';
  end if;

  if pg_catalog.jsonb_typeof(p_post->'tags') is distinct from 'array' then
    raise exception 'Post tags must be an array containing 3 to 6 strings';
  end if;

  if pg_catalog.jsonb_array_length(p_post->'tags') not between 3 and 6 then
    raise exception 'Post tags must be an array containing 3 to 6 strings';
  end if;

  if exists (
    select 1
      from pg_catalog.jsonb_array_elements(p_post->'tags') as tag(value)
     where pg_catalog.jsonb_typeof(tag.value) is distinct from 'string'
        or pg_catalog.btrim(tag.value #>> '{}') = ''
        or pg_catalog.length(tag.value #>> '{}') > 32
  ) then
    raise exception 'Each post tag must be a non-empty string of at most 32 characters';
  end if;

  image_metadata_value := nullif(p_post->'image_metadata', 'null'::jsonb);
  if nullif(p_post->>'cover_image', '') is null
     and nullif(p_post->>'social_image', '') is null
     and image_metadata_value is null then
    null;
  elsif coalesce(p_post->>'cover_image' !~ '^https://images[.]pexels[.]com/[^[:space:]]+$', true)
     or p_post->>'social_image' is distinct from p_post->>'cover_image'
     or pg_catalog.jsonb_typeof(image_metadata_value) is distinct from 'object'
     or image_metadata_value->>'provider' is distinct from 'Pexels'
     or coalesce(image_metadata_value->>'photoUrl' !~ '^https://www[.]pexels[.]com/[^[:space:]]+$', true)
     or coalesce(image_metadata_value->>'photographerUrl' !~ '^https://www[.]pexels[.]com/[^[:space:]]+$', true)
     or pg_catalog.btrim(coalesce(image_metadata_value->>'photographer', '')) = '' then
    raise exception 'Pexels image URLs or attribution metadata are invalid';
  end if;

  insert into public.blog_posts (
    slug,
    title,
    category,
    author,
    author_role,
    read_time,
    cover_image,
    tags,
    excerpt,
    content,
    published_at,
    is_published,
    updated_at,
    seo_title,
    meta_description,
    social_image,
    image_metadata,
    automation_run_id
  )
  values (
    p_post->>'slug',
    p_post->>'title',
    p_post->>'category',
    p_post->>'author',
    p_post->>'author_role',
    p_post->>'read_time',
    nullif(p_post->>'cover_image', ''),
    array(select pg_catalog.jsonb_array_elements_text(coalesce(p_post->'tags', '[]'::jsonb))),
    p_post->>'excerpt',
    p_post->>'content',
    (p_post->>'published_at')::timestamptz,
    true,
    pg_catalog.clock_timestamp(),
    p_post->>'seo_title',
    p_post->>'meta_description',
    nullif(p_post->>'social_image', ''),
    image_metadata_value,
    p_run_id
  )
  returning id::text into inserted_post_id;

  update public.automation_runs
     set status = 'succeeded',
         topic = p_post->>'title',
         post_id = inserted_post_id,
         completed_at = pg_catalog.clock_timestamp(),
         error_code = null
   where id = p_run_id
     and attempt_token = p_attempt_token
     and status = 'running'
     and started_at > pg_catalog.clock_timestamp() - interval '10 minutes';

  get diagnostics updated_rows = row_count;
  if updated_rows <> 1 then
    raise exception 'Automation attempt changed during publish';
  end if;

  return inserted_post_id;
end;
$$;

create function public.fail_daily_blog_run(
  p_run_id uuid,
  p_attempt_token uuid,
  p_error_code text
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
         error_code = left(p_error_code, 100),
         completed_at = pg_catalog.clock_timestamp()
   where id = p_run_id
     and attempt_token = p_attempt_token
     and status = 'running';

  get diagnostics updated_rows = row_count;
  return updated_rows = 1;
end;
$$;

revoke all on function public.claim_daily_blog_run(date, text) from public, anon, authenticated;
revoke all on function public.publish_daily_blog_post(uuid, uuid, jsonb) from public, anon, authenticated;
revoke all on function public.fail_daily_blog_run(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.claim_daily_blog_run(date, text) to service_role;
grant execute on function public.publish_daily_blog_post(uuid, uuid, jsonb) to service_role;
grant execute on function public.fail_daily_blog_run(uuid, uuid, text) to service_role;
