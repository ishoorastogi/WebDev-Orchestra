-- Durham Orchestra CMS: drafts are private, revisions are immutable, and the
-- current revision pointer is changed only by the transactional publish RPC.
create extension if not exists pgcrypto;

create table if not exists public.director_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_director()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.director_admins a where a.user_id = (select auth.uid())
  );
$$;

create table if not exists public.published_revisions (
  id uuid primary key default gen_random_uuid(),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  published_by uuid not null references auth.users(id),
  published_by_email text not null,
  description text not null default 'Website update',
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  singleton boolean primary key default true check (singleton),
  current_revision_id uuid references public.published_revisions(id),
  updated_at timestamptz not null default now()
);
insert into public.site_settings(singleton) values (true) on conflict (singleton) do nothing;

create table if not exists public.site_drafts (
  singleton boolean primary key default true check (singleton),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  original_filename text not null,
  content_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  alt_text text not null default '',
  is_published boolean not null default false,
  uploaded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.director_admins enable row level security;
alter table public.published_revisions enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_drafts enable row level security;
alter table public.media_assets enable row level security;

revoke all on public.director_admins, public.published_revisions, public.site_settings, public.site_drafts, public.media_assets from anon, authenticated;
grant select on public.director_admins to authenticated;
grant select (singleton, current_revision_id) on public.site_settings to anon, authenticated;
grant select (id, content) on public.published_revisions to anon, authenticated;
grant select (id, storage_path, content_type, original_filename, size_bytes, alt_text, is_published, created_at) on public.media_assets to anon;
grant select on public.site_drafts to authenticated;
grant select, insert, update, delete on public.media_assets to authenticated;

create policy "Director can verify own membership" on public.director_admins
  for select to authenticated using (user_id = (select auth.uid()));
create policy "Anyone can read active revision pointer" on public.site_settings
  for select to anon, authenticated using (true);
create policy "Anyone can read active revision; directors can read history" on public.published_revisions
  for select to anon, authenticated using (
    public.is_director() or id = (select s.current_revision_id from public.site_settings s where s.singleton)
  );
create policy "Director manages singleton draft" on public.site_drafts
  for all to authenticated using (public.is_director()) with check (public.is_director());
create policy "Director manages media metadata" on public.media_assets
  for all to authenticated using (public.is_director()) with check (public.is_director());
create policy "Public can read published file metadata" on public.media_assets
  for select to anon, authenticated using (is_published);

create or replace function public.save_site_draft(p_content jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  page_record record;
  updated_time timestamptz;
begin
  if actor is null or not public.is_director() then
    raise exception 'Director authorization required' using errcode = '42501';
  end if;
  if jsonb_typeof(p_content) is distinct from 'object'
     or jsonb_typeof(p_content->'nav') is distinct from 'array'
     or jsonb_typeof(p_content->'footer') is distinct from 'object'
     or jsonb_typeof(p_content->'pages') is distinct from 'object'
     or jsonb_typeof(p_content->'events') is distinct from 'array'
     or jsonb_array_length(p_content->'nav') > 20
     or jsonb_array_length(p_content->'events') > 200 then
    raise exception 'Invalid website content structure' using errcode = '22023';
  end if;
  for page_record in select key, value from jsonb_each(p_content->'pages') loop
    if jsonb_typeof(page_record.value->'title') is distinct from 'string'
       or jsonb_typeof(page_record.value->'sections') is distinct from 'array'
       or jsonb_array_length(page_record.value->'sections') > 40 then
      raise exception 'Invalid website page structure' using errcode = '22023';
    end if;
  end loop;

  insert into public.site_drafts(singleton, content, updated_by, updated_at)
  values (true, p_content, actor, now())
  on conflict (singleton) do update set content = excluded.content, updated_by = actor, updated_at = now()
  returning updated_at into updated_time;
  return updated_time;
end;
$$;
revoke all on function public.save_site_draft(jsonb) from public, anon;
grant execute on function public.save_site_draft(jsonb) to authenticated;

create or replace function public.publish_site_draft(revision_description text default 'Website update')
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  actor_email text;
  revision_id uuid;
  snapshot jsonb;
begin
  if actor is null or not public.is_director() then
    raise exception 'Director authorization required' using errcode = '42501';
  end if;
  select u.email into actor_email from auth.users u where u.id = actor;

  select d.content into snapshot from public.site_drafts d where d.singleton for update;
  if snapshot is null then raise exception 'No website draft exists'; end if;

  insert into public.published_revisions(content, published_by, published_by_email, description)
  values (snapshot, actor, coalesce(actor_email, 'Director'), left(coalesce(nullif(trim(revision_description), ''), 'Website update'), 200))
  returning id into revision_id;

  update public.site_settings set current_revision_id = revision_id, updated_at = now() where singleton;
  update public.media_assets m
    set is_published = position(m.id::text in snapshot::text) > 0;
  return revision_id;
end;
$$;
revoke all on function public.publish_site_draft(text) from public, anon;
grant execute on function public.publish_site_draft(text) to authenticated;

create or replace function public.get_published_history(p_offset integer default 0, p_page_size integer default 50)
returns table(id uuid, description text, created_at timestamptz, published_by_email text, total_count bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_director() then
    raise exception 'Director authorization required' using errcode = '42501';
  end if;
  return query select r.id, r.description, r.created_at, r.published_by_email, count(*) over ()
    from public.published_revisions r order by r.created_at desc
    limit greatest(1, least(coalesce(p_page_size, 50), 100)) offset greatest(coalesce(p_offset, 0), 0);
end;
$$;
revoke all on function public.get_published_history(integer, integer) from public, anon;
grant execute on function public.get_published_history(integer, integer) to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('orchestra-media', 'orchestra-media', false, 10485760,
  array['image/jpeg','image/png','image/webp','image/avif','application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif','application/pdf'];

grant select on storage.objects to anon;
grant select, insert, update, delete on storage.objects to authenticated;

create or replace function public.is_published_media(object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.media_assets m
    where m.storage_path = object_name and m.is_published
  );
$$;
revoke all on function public.is_published_media(text) from public;
grant execute on function public.is_published_media(text) to anon, authenticated;

create policy "Director manages private orchestra files" on storage.objects
  for all to authenticated using (bucket_id = 'orchestra-media' and public.is_director())
  with check (bucket_id = 'orchestra-media' and public.is_director());
create policy "Public can sign published orchestra files" on storage.objects
  for select to anon, authenticated using (
    bucket_id = 'orchestra-media' and (public.is_director() or public.is_published_media(name))
  );
