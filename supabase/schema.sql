create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('user','admin')),
  plan text not null default 'free' check (plan in ('free','starter','pro','team')),
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

create table public.folders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  folder_id uuid references public.folders(id) on delete set null,
  name text not null,
  kind text not null,
  is_dynamic boolean not null default true,
  payload text not null,
  slug text unique not null,
  style jsonb not null default '{}',
  ai_image_url text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.redirect_variants (
  id uuid primary key default gen_random_uuid(),
  qr_id uuid not null references public.qr_codes(id) on delete cascade,
  url text not null,
  weight int not null default 100,
  utm jsonb not null default '{}',
  conversion_pixel text,
  created_at timestamptz not null default now()
);

create table public.scan_events (
  id bigint generated always as identity primary key,
  qr_id uuid references public.qr_codes(id) on delete cascade,
  variant_id uuid references public.redirect_variants(id) on delete set null,
  visitor_hash text not null,
  country text,
  city text,
  device text,
  browser text,
  referrer text,
  scanned_at timestamptz not null default now()
);

create table public.conversion_events (
  id bigint generated always as identity primary key,
  qr_id uuid references public.qr_codes(id) on delete cascade,
  variant_id uuid references public.redirect_variants(id) on delete set null,
  event_name text not null,
  value numeric,
  metadata jsonb not null default '{}',
  converted_at timestamptz not null default now()
);

create table public.bulk_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  file_path text,
  status text not null default 'queued',
  total int not null default 0,
  completed int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.folders enable row level security;
alter table public.qr_codes enable row level security;
alter table public.redirect_variants enable row level security;
alter table public.scan_events enable row level security;
alter table public.conversion_events enable row level security;
alter table public.bulk_jobs enable row level security;

create policy "profiles own row" on public.profiles for all using (auth.uid() = id);
create policy "folders owner" on public.folders for all using (auth.uid() = owner_id);
create policy "qr owner" on public.qr_codes for all using (auth.uid() = owner_id);
create policy "variants via owner" on public.redirect_variants for all using (exists (select 1 from public.qr_codes q where q.id = qr_id and q.owner_id = auth.uid()));
create policy "scan read via owner" on public.scan_events for select using (exists (select 1 from public.qr_codes q where q.id = qr_id and q.owner_id = auth.uid()));
create policy "conversion read via owner" on public.conversion_events for select using (exists (select 1 from public.qr_codes q where q.id = qr_id and q.owner_id = auth.uid()));
create policy "bulk owner" on public.bulk_jobs for all using (auth.uid() = owner_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
