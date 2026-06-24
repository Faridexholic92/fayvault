const FAQ = [
  {
    q: "Macam mana nak simpan prompt?",
    a: 'Tekan "+ Prompt Baru", isi tajuk, penerangan, badan prompt, dan tag. Tekan Simpan — prompt akan muncul dalam Semua Prompt & dikira dalam Dashboard.',
  },
  {
    q: "Apa itu variables {nama}?",
    a: "Tulis pemboleh ubah dalam badan prompt guna kurungan, contoh {subjek} atau {gaya}. Sistem auto kesan dan kau boleh isi nilai berbeza masa Test Live tanpa ubah prompt asal.",
  },
  {
    q: "Macam mana guna Test Live?",
    a: "Buka mana-mana prompt, isi nilai untuk setiap variable, kemudian jalankan untuk lihat output model (Gemini) terus dalam app.",
  },
  {
    q: "Koleksi tu untuk apa?",
    a: "Koleksi ialah folder untuk susun prompt ikut projek atau tema (cth: Poster Gundam, Cyberpunk). Urus di tab Koleksi.",
  },
  {
    q: "Macam mana nak padam prompt?",
    a: "Di Semua Prompt, tekan ikon 🗑️ pada kad prompt. Atau buka prompt dan tekan butang Padam.",
  },
  {
    q: "Data aku selamat tak?",
    a: "Ya. Setiap prompt terikat pada akaun kau (Row Level Security di Supabase) — orang lain tak boleh baca prompt private kau.",
  },
]

export default function BantuanPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Bantuan</h1>
        <p className="text-gray-500">Soalan lazim tentang Prompt Vault.</p>
      </div>
      <div className="space-y-3">
        {FAQ.map((item) => (
          <details
            key={item.q}
            className="bg-white border rounded-lg p-4 group"
          >
            <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
              {item.q}
              <span className="text-gray-400 group-open:rotate-180 transition">
                ▾
              </span>
            </summary>
            <p className="text-sm text-gray-600 mt-3">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
