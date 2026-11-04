create extension if not exists pgcrypto;

create table public.treatments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text not null default '',
  body text not null default '',
  created_at timestamptz not null default now()
);

create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  city text not null,
  country text not null default 'Vietnam',
  description text not null default '',
  years_experience int check (years_experience is null or years_experience >= 0),
  languages text[] not null default '{}',
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.clinic_treatments (
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  treatment_id uuid not null references public.treatments(id) on delete cascade,
  price_from numeric not null check (price_from >= 0),
  price_to numeric check (price_to is null or price_to >= price_from),
  currency text not null default 'AUD',
  price_unit text not null default '',
  inclusions text[] not null default '{}',
  primary key (clinic_id, treatment_id)
);

create table public.clinic_photos (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  storage_path text not null,
  sort_order int not null default 0
);
create index clinic_photos_clinic_idx on public.clinic_photos (clinic_id, sort_order);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references public.clinics(id) on delete set null,
  treatment_id uuid references public.treatments(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  preferred_channel text not null check (preferred_channel in ('whatsapp', 'viber', 'telegram', 'email')),
  message text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.treatments enable row level security;
alter table public.clinics enable row level security;
alter table public.clinic_treatments enable row level security;
alter table public.clinic_photos enable row level security;
alter table public.enquiries enable row level security;

-- Public read access
create policy "public read treatments" on public.treatments
  for select to anon, authenticated using (true);

create policy "public read published clinics" on public.clinics
  for select to anon using (is_published);

create policy "public read prices of published clinics" on public.clinic_treatments
  for select to anon using (
    exists (select 1 from public.clinics c where c.id = clinic_id and c.is_published)
  );

create policy "public read photos of published clinics" on public.clinic_photos
  for select to anon using (
    exists (select 1 from public.clinics c where c.id = clinic_id and c.is_published)
  );

-- Public may only create enquiries, always with status 'new'
create policy "public insert enquiries" on public.enquiries
  for insert to anon, authenticated with check (status = 'new');

-- Everything else requires an authenticated user
create policy "auth all treatments" on public.treatments
  for all to authenticated using (true) with check (true);
create policy "auth all clinics" on public.clinics
  for all to authenticated using (true) with check (true);
create policy "auth all clinic_treatments" on public.clinic_treatments
  for all to authenticated using (true) with check (true);
create policy "auth all clinic_photos" on public.clinic_photos
  for all to authenticated using (true) with check (true);
create policy "auth read enquiries" on public.enquiries
  for select to authenticated using (true);
create policy "auth update enquiries" on public.enquiries
  for update to authenticated using (true) with check (true);
create policy "auth delete enquiries" on public.enquiries
  for delete to authenticated using (true);

-- Storage: bucket "clinic-photos" is public for reads; only authenticated users may write
create policy "auth upload clinic photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'clinic-photos');
create policy "auth update clinic photos" on storage.objects
  for update to authenticated using (bucket_id = 'clinic-photos');
create policy "auth delete clinic photos" on storage.objects
  for delete to authenticated using (bucket_id = 'clinic-photos');
