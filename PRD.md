# PRD — Peka

**Hackathon:** Top 99 IndonesiaNEXT (10th Batch) — Role: Hacker
**Tema:** Kesehatan Mental & Wellbeing
**Deadline:** 26 Juli 2026, 17.00 WIB

---

## 1. Latar Belakang Masalah

Orang sering mengalami perubahan mood dalam keseharian (kewalahan, cemas, kesal, capek) tapi tidak punya cara cepat untuk "menangkap" perasaan itu saat terjadi. Kebanyakan aplikasi self-help memberi saran generik ("coba tarik napas") yang tidak nyambung dengan situasi spesifik penggunanya. Akibatnya, orang cenderung mengabaikan mood-nya sampai menumpuk.

## 2. Target Pengguna

Gen Z & muda-mudi (18-27 tahun) yang aktif di media sosial, terbiasa dengan aplikasi berbasis card/visual, dan butuh validasi/insight cepat tanpa harus baca artikel panjang.

## 3. Tujuan Produk

- Memberi user cara cepat (< 1 menit) untuk mencatat & memahami mood-nya
- Memberi saran/intervensi kecil yang **dipersonalisasi** berdasarkan konteks, bukan template generik
- Membantu user melihat pola mood dari waktu ke waktu

## 4. User Stories

- Sebagai user, saya ingin login dengan cepat supaya riwayat mood saya tersimpan dan bisa diakses kapan saja.
- Sebagai user, saya ingin mencatat mood + pemicu singkat supaya saya bisa dapat saran yang relevan dengan situasi saya saat ini.
- Sebagai user, saya ingin melihat saran/micro-intervention yang terasa personal, bukan template umum.
- Sebagai user, saya ingin melihat riwayat mood saya supaya saya bisa mengenali pola dari waktu ke waktu.
- Sebagai user, saya ingin membuat kartu ringkasan mood yang bisa saya share ke Instagram Story.
- Sebagai user yang lama tidak buka app, saya ingin diingatkan secara halus untuk cek-in lagi.

## 5. Fitur — MVP (Wajib, prioritas utama)

| # | Fitur | Deskripsi | Acceptance Criteria |
|---|---|---|---|
| 1 | Login sederhana | Auth via Supabase (email/magic link) | User bisa daftar & login, session persist |
| 2 | Input mood + pemicu | Pilih mood dari opsi visual + isi teks pemicu singkat | Data tersimpan ke database dengan benar |
| 3 | Generate micro-intervention | Kirim mood+pemicu ke LLM API, tampilkan saran 2 menit yang personal | Response muncul < 5 detik, ada fallback jika API gagal |
| 4 | Riwayat mood | List/dashboard riwayat entry mood user | Data terurut dari terbaru, bisa di-scroll |

## 6. Fitur — Sekunder (kerjakan HANYA jika fondasi MVP sudah selesai & stabil)

| # | Fitur | Deskripsi |
|---|---|---|
| 5 | Animasi | Transisi & micro-interaction pakai Framer Motion |
| 6 | Mood recap card | Generate gambar ringkasan mood mingguan, bisa di-download untuk share ke IG Story |
| 7 | In-app reminder banner | Banner halus di dalam app kalau user lama tidak cek-in (bukan push notification asli) |

## 7. Eksplisit Di Luar Scope (jangan dikerjakan, demi waktu)

- Push notification asli (service worker/permission)
- Fitur sosial (komentar, follow, like antar user)
- Direct posting API ke Instagram/media sosial lain
- Multi-bahasa
- Admin panel/moderasi

## 8. Tech Stack

- **Frontend:** Vite + React + Tailwind + Framer Motion
- **Backend & Database:** Supabase (Postgres + Auth)
- **AI/LLM:** Gemini API (micro-intervention generation)
- **Image generation:** html-to-image / html2canvas (untuk mood recap card)
- **Deploy:** Vercel (frontend), Supabase (backend/db) — dipilih karena butuh live public URL secepat mungkin, bukan VPS pribadi yang masih tahap setup
- **Dibangun dengan bantuan:** Antigravity (AI coding agent) untuk mempercepat development dalam batas waktu 24 jam

## 9. Skema Database (Supabase)

**Tabel `mood_entries`**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | foreign key ke auth.users |
| mood | text | contoh: "kewalahan", "cemas", "kesal", "sedih", "capek" |
| trigger_text | text | pemicu singkat yang diketik user |
| ai_response | text | hasil generate dari LLM |
| helpful | boolean, nullable | feedback user (membantu/tidak) |
| created_at | timestamptz | default now() |

> Catatan penting: aktifkan **Row Level Security (RLS)** di Supabase, dengan policy user hanya bisa akses baris miliknya sendiri (`user_id = auth.uid()`). Ini sering terlewat dan bikin fitur gagal total kalau lupa.

## 10. Penggunaan AI (wajib didokumentasikan sesuai aturan hackathon)

- **Dalam produk:** LLM API dipakai untuk generate micro-intervention yang dipersonalisasi berdasarkan mood + konteks pemicu yang diketik user (bukan template statis).
- **Dalam proses development:** Antigravity (AI coding agent) dipakai untuk mempercepat penulisan kode dalam batas waktu 24 jam, dengan supervisi & review manual dari developer.

## 11. Catatan Etis (penting, sertakan di footer UI)

Aplikasi ini adalah alat bantu self-awareness harian, **bukan pengganti terapi atau diagnosis profesional**. Sertakan disclaimer singkat di footer: *"Bukan pengganti bantuan profesional. Kalau kamu butuh dukungan lebih, hubungi profesional kesehatan mental."*

## 12. Metodologi

Agile — bangun MVP (fitur wajib) dulu sampai stabil, baru kerjakan fitur sekunder sebagai iterasi berikutnya jika waktu tersisa. Lihat `checklist.md` untuk breakdown waktu per fase.
