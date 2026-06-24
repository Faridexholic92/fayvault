-- =========================================
-- FIX: profil hilang + laluan simpan bullet-proof
-- Jalankan SEKALI di Supabase > SQL Editor > Run
-- =========================================

-- 1) Backfill profil untuk semua user sedia ada (selesai bil_user > bil_profile)
insert into profiles (id, username)
select u.id, split_part(u.email, '@', 1)
from auth.users u
left join profiles p on p.id = u.id
where p.id is null;

-- 2) Pastikan trigger auto-profil kukuh (tak gagal kalau profil dah ada)
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- 3) Fungsi simpan prompt: auto-ensure profil, set pemilik dari auth.uid()
create or replace function save_prompt(
  p_id uuid,
  p_title text,
  p_description text,
  p_body text,
  p_tags text[],
  p_variables text[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  result_id uuid;
begin
  if uid is null then
    raise exception 'TIDAK_LOG_MASUK';
  end if;

  -- pastikan profil wujud
  insert into profiles (id) values (uid) on conflict (id) do nothing;

  if p_id is null then
    insert into prompts (owner_id, title, description, body, tags, variables)
    values (uid, p_title, p_description, p_body, p_tags, p_variables)
    returning id into result_id;
  else
    update prompts set
      title = p_title,
      description = p_description,
      body = p_body,
      tags = p_tags,
      variables = p_variables,
      updated_at = now()
    where id = p_id and owner_id = uid
    returning id into result_id;
  end if;

  return result_id;
end;
$$;

grant execute on function save_prompt(uuid, text, text, text, text[], text[])
  to authenticated;
