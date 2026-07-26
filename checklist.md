# Checklist Eksekusi — Peka (24-Hour Hackathon)

Deadline: **26 Juli 2026, 17.00 WIB**. Semua blok waktu di bawah relatif ("Jam ke-0" = mulai sekarang) — sesuaikan sama jam mulai Abay yang sebenarnya. Target: **selesai coding minimal 3-4 jam sebelum deadline**, sisanya buat buffer testing & submit, jangan mepet-mepet.

---

## FASE 0 — Setup (Jam ke-0 s/d 1)

- [ ] Finalisasi `PRD.md` dan `design.md` (edit kalau ada detail yang mau diubah)
- [ ] Buat repo GitHub baru
- [ ] `.gitignore` — pastikan `.env`, `node_modules` masuk dari awal (JANGAN sampai API key ke-commit)
- [ ] Setup project Vite + React + Tailwind
- [ ] Buat project baru di Supabase, catat `SUPABASE_URL` dan `SUPABASE_ANON_KEY`
- [ ] Buat API key LLM (Claude/Gemini), simpan di `.env` (jangan hardcode di kode)
- [ ] Commit pertama: `chore: initial project setup`

## FASE 1 — Database & Auth (Jam ke-1 s/d 2)

- [ ] Buat tabel `mood_entries` di Supabase sesuai skema di `PRD.md`
- [ ] **Aktifkan Row Level Security (RLS)** dan buat policy `user_id = auth.uid()` — JANGAN SKIP, ini gotcha paling umum bikin fitur gagal total saat demo
- [ ] Setup Supabase Auth (email/magic link)
- [ ] Test: bisa signup, login, logout dari halaman kosong sederhana
- [ ] Commit: `feat: setup supabase auth and database schema`

## FASE 2 — Core Feature: Mood Check-in (Jam ke-2 s/d 4)

- [x] Bangun komponen `MoodPicker` (5 opsi mood)
- [x] Bangun komponen `TriggerInput`
- [x] Integrasi LLM API — kirim mood+trigger, terima response
- [x] **Buat fallback response** kalau LLM API gagal/timeout (jangan biarkan app blank/crash)
- [x] Simpan entry ke Supabase setelah dapat response
- [x] Test end-to-end: pilih mood → isi pemicu → dapat saran → tersimpan ke database
- [x] Commit: `feat: mood check-in and AI micro-intervention`

## FASE 3 — Riwayat & Dashboard (Jam ke-4 s/d 5)

- [x] Bangun `HistoryList` — tampilkan entry mood user, terbaru di atas
- [x] Tombol feedback "Membantu/Kurang membantu" pada tiap entry
- [x] Test: data baru langsung muncul di riwayat tanpa refresh manual (atau minimal setelah refresh)
- [x] Commit: `feat: mood history dashboard`

**>>> CHECKPOINT: Fondasi MVP selesai di sini. Jangan lanjut ke fitur sekunder kalau bagian di atas belum stabil & bebas bug. <<<**

## FASE 4 — Fitur Sekunder (Jam ke-5 s/d 8, HANYA jika Fase 0-3 sudah solid)

- [x] Tambahkan Framer Motion — animasi `MoodPicker` (scale on select) dan fade-in `AIResponseCard`
- [ ] Bangun `ReminderBanner` (logic sederhana: cek `created_at` entry terakhir, tampilkan banner kalau > 2 hari)
- [ ] Bangun `RecapCardGenerator` (render ringkasan mood minggu ini + tombol download gambar via html-to-image)
- [ ] Commit terpisah untuk tiap fitur: `feat: animations`, `feat: reminder banner`, `feat: mood recap card`

## FASE 5 — Istirahat Wajib (Jam ke-8 s/d ~13-14)

- [ ] Tidur minimal 5-6 jam. Otak yang lelah bikin bug lebih lama ditemukan, bukan lebih cepat.

## FASE 6 — Debug & Testing (setelah bangun, alokasikan 2-3 jam)

- [ ] Test full flow dari awal: signup baru → login → check-in mood → lihat response → cek riwayat → logout → login lagi (data masih ada?)
- [ ] Test di HP asli (bukan cuma resize browser laptop)
- [ ] Test skenario gagal: matikan koneksi internet sebentar saat generate AI response — apakah muncul pesan error yang wajar, bukan crash?
- [ ] Test entry kosong/input aneh (pemicu dikosongin, spam emoji, dll) — pastikan gak bikin app crash
- [ ] Cek console browser — bersihkan warning/error yang keliatan
- [ ] Cek ulang: RLS Supabase masih aktif dan benar (user A gak bisa lihat data user B)
- [ ] Cek ulang: tidak ada API key/secret yang ke-commit ke GitHub (`git log -p | grep -i key` sebagai sanity check)

## FASE 7 — Deploy (1-2 jam)

- [ ] Push final ke GitHub
- [ ] Deploy ke Vercel/Netlify, hubungkan ke repo GitHub
- [ ] Masukkan environment variables (Supabase URL/key, LLM API key) di dashboard Vercel/Netlify — **jangan lupa langkah ini**, penyebab umum app "putih polos" pas live padahal lokal jalan normal
- [ ] Buka URL public hasil deploy, ulangi test full flow di Fase 6 sekali lagi di environment production (bukan cuma di lokal)
- [ ] Cek responsive di HP lewat URL public asli

## FASE 8 — Dokumentasi & Submission (1 jam, jangan mepet deadline)

- [ ] Finalisasi `PRD.md` — cek semua bagian sesuai kondisi app final (kalau ada fitur yang di-skip, update dokumennya biar jujur/konsisten)
- [ ] Cantumkan penjelasan penggunaan AI (development + fitur produk) sesuai poin 10 di `PRD.md`
- [ ] Cek Git commit history — pastikan rapi dan bisa "bercerita" progresnya (bukan 1 commit besar di akhir)
- [ ] Siapkan link: repo GitHub (public), URL deploy live, PRD.md
- [ ] Isi Google Form submission sesuai instruksi role Hacker dari grup
- [ ] Submit **minimal 1 jam sebelum deadline** — jangan submit di menit-menit terakhir, jaringan/form bisa saja bermasalah

---

## Prinsip Selama 24 Jam Ini

1. **Fondasi dulu, hiasan belakangan** — jangan mulai fitur sekunder sebelum checkpoint Fase 3 lolos.
2. **Commit sering, pesan jelas** — juri menilai dari commit history, bukan cuma hasil akhir.
3. **Kalau stuck > 30 menit di satu bug**, tinggalkan dulu, kerjain bagian lain, balik lagi nanti dengan kepala lebih jernih.
4. **Tidur itu bagian dari strategi, bukan kemewahan** — submisi yang stabil jam 5 sore lebih baik daripada submisi berantakan jam 4:59.
