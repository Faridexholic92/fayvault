# Prompt Vault

Vault peribadi untuk **simpan & susun koleksi prompt kau**. Ada login (private), borang simpan, senarai + carian/tag, edit/padam. Bonus: **Test Live** (cuba prompt dengan AI).

## Setup

```bash
npm install
cp .env.local.example .env.local   # isi 3 kunci
npm run dev
```

Isi `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase > Settings > API > Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - anon public key
- `GEMINI_API_KEY` - untuk Test Live (https://aistudio.google.com)

## Database

Buka Supabase > SQL Editor > tampal isi `supabase/schema.sql` > Run.
(Kalau kau dah run sebelum ni, tak payah ulang.)

## Auth

Guna Supabase Auth (email + kata laluan).

- Untuk dev senang: Supabase > Authentication > Providers > Email > **matikan "Confirm email"** supaya boleh terus log masuk tanpa klik link.
- Untuk production: hidupkan balik & set Site URL + Redirect URLs ke domain Vercel kau (Supabase > Authentication > URL Configuration).

## Halaman

- `/login` - log masuk / daftar
- `/vault` - senarai prompt kau + cari/tapis tag
- `/vault/new` - simpan prompt baru
- `/vault/[id]` - edit / padam / Test Live

## Deploy (Vercel)

1. Push ke GitHub
2. Import projek di Vercel
3. Isi 3 env vars (sama macam `.env.local`)
4. Deploy
5. Tambah domain Vercel dalam Supabase Auth URL Configuration
