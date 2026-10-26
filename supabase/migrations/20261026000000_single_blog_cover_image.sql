do $$
begin
  if exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'blog_posts'
       and column_name = 'social_image'
  ) then
    update public.blog_posts
       set cover_image = coalesce(nullif(pg_catalog.btrim(cover_image), ''), nullif(pg_catalog.btrim(social_image), ''))
     where nullif(pg_catalog.btrim(cover_image), '') is null
       and nullif(pg_catalog.btrim(social_image), '') is not null;

    alter table public.blog_posts drop column social_image;
  end if;
end;
$$;

create or replace function public.publish_daily_blog_post(
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
  cover_image_value text;
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

  cover_image_value := nullif(p_post->>'cover_image', '');
  image_metadata_value := nullif(p_post->'image_metadata', 'null'::jsonb);

  if cover_image_value is null and image_metadata_value is null then
    null;
  else
    if cover_image_value is null
       or cover_image_value !~ '^https://[^[:space:]]+$' then
      raise exception 'cover_image must be a valid HTTPS URL when an image is provided';
    end if;

    if image_metadata_value is not null
       and pg_catalog.jsonb_typeof(image_metadata_value) is distinct from 'object' then
      raise exception 'image_metadata must be a JSON object when provided';
    end if;

    if image_metadata_value is not null then
      if (image_metadata_value->>'photoUrl') is not null
         and (image_metadata_value->>'photoUrl') !~ '^https://[^[:space:]]+$' then
        raise exception 'image_metadata.photoUrl must be a valid HTTPS URL';
      end if;

      if (image_metadata_value->>'photographerUrl') is not null
         and (image_metadata_value->>'photographerUrl') !~ '^https://[^[:space:]]+$' then
        raise exception 'image_metadata.photographerUrl must be a valid HTTPS URL';
      end if;
    end if;
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
    cover_image_value,
    array(select pg_catalog.jsonb_array_elements_text(coalesce(p_post->'tags', '[]'::jsonb))),
    p_post->>'excerpt',
    p_post->>'content',
    (p_post->>'published_at')::timestamptz,
    true,
    pg_catalog.clock_timestamp(),
    p_post->>'seo_title',
    p_post->>'meta_description',
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

revoke all on function public.publish_daily_blog_post(uuid, uuid, jsonb) from public, anon, authenticated;
grant execute on function public.publish_daily_blog_post(uuid, uuid, jsonb) to service_role;
