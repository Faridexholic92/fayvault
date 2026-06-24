-- =========================================
-- SKEMA - Fasa 1 (Prompt Vault)
-- =========================================

-- 1. PROFILES (sambungan kepada auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2. COLLECTIONS (folder)
create table collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- 3. PROMPTS
create table prompts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  collection_id uuid references collections(id) on delete set null,
  title text not null,
  description text,
  body text not null,
  category text,
  tags text[] default '{}',
  variables text[] default '{}',
  visibility text not null default 'private' check (visibility in ('private','public')),
  price numeric default 0,
  target_model text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. VERSIONS (sejarah versi)
create table versions (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references prompts(id) on delete cascade,
  version_no int not null,
  body text not null,
  changelog text,
  created_at timestamptz default now()
);

-- 5. RUNS (log test live)
create table runs (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid references prompts(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  input_vars jsonb,
  output text,
  model text,
  created_at timestamptz default now()
);

-- INDEX (laju carian + tapis)
create index prompts_owner_idx  on prompts(owner_id);
create index prompts_tags_idx   on prompts using gin(tags);
create index prompts_search_idx on prompts
  using gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,'')));
create index versions_prompt_idx on versions(prompt_id);

-- =========================================
-- RLS (Row Level Security)
-- =========================================
alter table profiles    enable row level security;
alter table prompts     enable row level security;
alter table versions    enable row level security;
alter table collections enable row level security;
alter table runs        enable row level security;

-- PROFILES: sesiapa boleh baca, owner boleh ubah
create policy "profiles_read"   on profiles for select using (true);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- PROMPTS: public boleh baca yang 'public'; owner kawalan penuh
create policy "prompts_select" on prompts for select
  using (visibility = 'public' or owner_id = auth.uid());
create policy "prompts_insert" on prompts for insert
  with check (owner_id = auth.uid());
create policy "prompts_update" on prompts for update
  using (owner_id = auth.uid());
create policy "prompts_delete" on prompts for delete
  using (owner_id = auth.uid());

-- VERSIONS: ikut keizinan prompt induk
create policy "versions_select" on versions for select using (
  exists (select 1 from prompts p
          where p.id = prompt_id
            and (p.visibility = 'public' or p.owner_id = auth.uid())));
create policy "versions_insert" on versions for insert with check (
  exists (select 1 from prompts p
          where p.id = prompt_id and p.owner_id = auth.uid()));

-- COLLECTIONS & RUNS: milik sendiri sahaja
create policy "collections_all" on collections for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "runs_select" on runs for select using (user_id = auth.uid());
create policy "runs_insert" on runs for insert with check (user_id = auth.uid());

-- Auto-cipta profile bila pengguna baru daftar
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
