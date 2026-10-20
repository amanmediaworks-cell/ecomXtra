-- Replace every REPLACE_WITH_EXISTING_ADMIN_AUTH_UID token with the Auth UID
-- already authorized by the existing blog_posts write policies.
alter table public.blog_posts
  add column if not exists seo_title text,
  add column if not exists meta_description text,
  add column if not exists canonical_url text,
  add column if not exists social_image text;

do $$
begin
  if exists (
    select slug
    from public.blog_posts
    where slug is not null
    group by slug
    having count(*) > 1
  ) then
    raise exception 'Duplicate blog_posts.slug values exist. Resolve them before creating the unique slug index.';
  end if;
end;
$$;

create unique index if not exists blog_posts_slug_unique_idx
  on public.blog_posts (slug)
  where slug is not null;

-- Keep the existing read policy, while enforcing that anonymous clients can
-- only read published rows and the existing admin can also read drafts.
drop policy if exists "blog_posts_seo_authorized_admin_read" on public.blog_posts;
create policy "blog_posts_seo_authorized_admin_read"
  on public.blog_posts
  for select
  to authenticated
  using (auth.uid() = 'REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid);

drop policy if exists "blog_posts_seo_published_read_guard" on public.blog_posts;
create policy "blog_posts_seo_published_read_guard"
  on public.blog_posts
  as restrictive
  for select
  to anon, authenticated
  using (
    is_published = true
    or auth.uid() = 'REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid
  );
