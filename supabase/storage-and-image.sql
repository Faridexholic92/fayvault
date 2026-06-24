-- =========================================
-- TAMBAH: cover image + Supabase Storage
-- Jalankan SEKALI di Supabase > SQL Editor > Run
-- =========================================

-- 1) Medan gambar pada prompts
alter table prompts add column if not exists image_url text;

-- 2) Bucket storage 'covers' (public untuk dibaca)
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

-- 3) Policy storage: sesiapa boleh BACA; pengguna log masuk
--    boleh upload/ubah/padam HANYA dalam folder ID sendiri
drop policy if exists "covers_read"   on storage.objects;
drop policy if exists "covers_insert" on storage.objects;
drop policy if exists "covers_update" on storage.objects;
drop policy if exists "covers_delete" on storage.objects;

create policy "covers_read" on storage.objects
  for select using (bucket_id = 'covers');

create policy "covers_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "covers_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "covers_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4) Kemaskini fungsi save_prompt supaya simpan image_url
--    (buang versi lama 6-argumen, ganti dengan 7-argumen)
drop function if exists save_prompt(uuid, text, text, text, text[], text[]);

create or replace function save_prompt(
  p_id uuid,
  p_title text,
  p_description text,
  p_body text,
  p_tags text[],
  p_variables text[],
  p_image_url text default null
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

  insert into profiles (id) values (uid) on conflict (id) do nothing;

  if p_id is null then
    insert into prompts (owner_id, title, description, body, tags, variables, image_url)
    values (uid, p_title, p_description, p_body,
            coalesce(p_tags, '{}'), coalesce(p_variables, '{}'), p_image_url)
    returning id into result_id;
  else
    update prompts set
      title       = p_title,
      description = p_description,
      body        = p_body,
      tags        = coalesce(p_tags, '{}'),
      variables   = coalesce(p_variables, '{}'),
      image_url   = coalesce(p_image_url, image_url),
      updated_at  = now()
    where id = p_id and owner_id = uid
    returning id into result_id;
  end if;

  return result_id;
end;
$$;

grant execute on function
  save_prompt(uuid, text, text, text, text[], text[], text)
  to authenticated;
