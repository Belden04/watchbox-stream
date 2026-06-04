
-- Roles enum
create type public.app_role as enum ('admin', 'moderator', 'user');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles_self_read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_self_write" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_self_insert" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "user_roles_self_read" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create or replace function public.claim_admin()
returns boolean language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then return false; end if;
  if exists (select 1 from public.user_roles where role = 'admin') then return false; end if;
  insert into public.user_roles(user_id, role) values (v_uid, 'admin');
  return true;
end; $$;
grant execute on function public.claim_admin() to authenticated;

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Movies
create table public.movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  poster_url text not null,
  video_url text,
  year int default extract(year from now())::int,
  genre text,
  language text,
  country text,
  director text,
  translator text,
  duration text,
  rating numeric default 0,
  is_translated boolean not null default false,
  is_trending boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.movies to anon, authenticated;
grant insert, update, delete on public.movies to authenticated;
grant all on public.movies to service_role;
alter table public.movies enable row level security;
create policy "movies_public_read" on public.movies for select to anon, authenticated using (true);
create policy "movies_admin_write" on public.movies for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Highlights
create table public.highlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  thumbnail_url text not null,
  video_url text,
  category text,
  duration text,
  created_at timestamptz not null default now()
);
grant select on public.highlights to anon, authenticated;
grant insert, update, delete on public.highlights to authenticated;
grant all on public.highlights to service_role;
alter table public.highlights enable row level security;
create policy "highlights_public_read" on public.highlights for select to anon, authenticated using (true);
create policy "highlights_admin_write" on public.highlights for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Storage policies: public read on the 3 buckets, admin write
create policy "media_public_read" on storage.objects for select to anon, authenticated
  using (bucket_id in ('posters','videos','thumbnails'));
create policy "media_admin_write" on storage.objects for insert to authenticated
  with check (bucket_id in ('posters','videos','thumbnails') and public.has_role(auth.uid(),'admin'));
create policy "media_admin_update" on storage.objects for update to authenticated
  using (bucket_id in ('posters','videos','thumbnails') and public.has_role(auth.uid(),'admin'));
create policy "media_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id in ('posters','videos','thumbnails') and public.has_role(auth.uid(),'admin'));
