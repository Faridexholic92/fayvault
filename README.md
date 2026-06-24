# Prompt Vault — Starter (Fasa 1)

Tool untuk **simpan, susun, test & jual prompt**. Starter ni dah ada ciri pembeza utama: **Test Live** (isi variable → run AI → tengok output).

## Cara mula

```bash
# 1. Pasang dependency
npm install

# 2. Salin env & isi kunci kau
cp .env.local.example .env.local
#   - NEXT_PUBLIC_SUPABASE_URL
#   - NEXT_PUBLIC_SUPABASE_ANON_KEY
#   - GEMINI_API_KEY  (dari https://aistudio.google.com)

# 3. Cipta jadual DB: buka Supabase > SQL Editor,
#    salin-tampal isi supabase/schema.sql, run.

# 4. Jalankan
npm run dev
# buka http://localhost:3000
```

## Apa yang dah siap

- `app/page.tsx` — demo **Test Live** (editor + auto-detect variable + run AI)
- `lib/parse-variables.ts` — cari & isi corak `{nama}`
- `lib/supabase/` — client (browser) + server
- `app/api/run/route.ts` — endpoint panggil Gemini (server-side, kunci selamat)
- `components/prompt-editor.tsx` — editor CodeMirror + papar variable dikesan
- `components/variable-form.tsx` — borang auto dari variable + butang Test Live
- `supabase/schema.sql` — jadual + RLS + trigger

## Langkah seterusnya (rujuk blueprint Notion)

1. Auth (Supabase Auth)
2. CRUD prompt + simpan ke DB
3. Version history
4. Carian + tag
5. Public link `/p/[id]`

## Nota keselamatan

- `GEMINI_API_KEY` HANYA di server (`api/run`). Jangan dedah di client.
- Sebelum production: tambah had kadar (cth 10 run/hari/user) + sahkan auth dalam `api/run`.
