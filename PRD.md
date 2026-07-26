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

## 5. Fitur — MVP (Telah Diimplementasikan Penuh)

| # | Fitur | Deskripsi | Status |
|---|---|---|---|
| 1 | Login sederhana | Auth via Supabase (email, Google OAuth) lengkap dengan Privacy Consent | Selesai |
| 2 | Input mood + pemicu | Pilih mood dari opsi visual + isi teks pemicu singkat | Selesai |
| 3 | Context-Aware AI | AI membaca riwayat mood pengguna di hari yang sama untuk respons yang nyambung | Selesai |
| 4 | Riwayat mood | List riwayat mood dengan grouping tanggal, filter waktu, dan pagination | Selesai |

## 6. Fitur — Sekunder (Telah Diimplementasikan Penuh)

| # | Fitur | Deskripsi | Status |
|---|---|---|---|
| 5 | Animasi UI | Transisi elegan, modal, & micro-interaction pakai Framer Motion | Selesai |
| 6 | Mood recap card | Gambar ringkasan mood mingguan yang bisa di-download sebagai gambar (PNG) | Selesai |
| 7 | In-app reminder banner | Banner otomatis jika pengguna belum cek-in, beserta perhitungan Streak | Selesai |

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

## 10. Penggunaan AI (Pengembangan & Fungsionalitas Aplikasi)

Sesuai dengan ketentuan *hackathon*, berikut adalah penjabaran transparansi penggunaan AI di proyek Peka:

**1. Dalam Fungsionalitas Produk (Context-Aware AI):**
- Aplikasi menggunakan model LLM (Gemini) secara dinamis untuk merespons perasaan pengguna (*Micro-Intervention*).
- AI di aplikasi ini tidak merespons secara buta. Sebelum memanggil AI, sistem mengambil **riwayat perjalanan emosi pengguna pada hari tersebut** dan mengirimkannya sebagai *system prompt* terselubung.
- Dengan cara ini, AI dapat mengetahui kronologi hari pengguna (contoh: *"tadi pagi kamu capek, siangnya sedih, dan sore ini kamu marah"*), sehingga respons yang diberikan jauh lebih berempati, personal, dan terasa seperti berbicara dengan manusia yang "peka" terhadap keseharian pengguna.
- Untuk menjamin privasi, data mood ini diproses secara anonim *on-the-fly* dan kami mengharuskan pengguna menyetujui Kebijakan Privasi Peka sebelum mendaftar (wajib centang atau setuju).

**2. Dalam Proses Development:**
- Pengembangan UI/UX, logika bisnis, dan *debugging* dipercepat menggunakan **Antigravity (AI coding agent)**.
- Developer berperan sebagai "Sutradara/Arsitek" yang merancang logika (seperti merancang *Context-Aware AI*, struktur *database*, dan *Privacy Policy flow*), sementara AI agent bertindak mengeksekusi penulisan kode dalam batas waktu *hackathon* (24 jam), dengan supervisi, *review* arsitektur, dan instruksi presisi dari developer manusia.

## 11. Catatan Etis (penting, sertakan di footer UI)

Aplikasi ini adalah alat bantu self-awareness harian, **bukan pengganti terapi atau diagnosis profesional**. Sertakan disclaimer singkat di footer: *"Bukan pengganti bantuan profesional. Kalau kamu butuh dukungan lebih, hubungi profesional kesehatan mental."*

## 12. Metodologi

Agile — bangun MVP (fitur wajib) dulu sampai stabil, baru kerjakan fitur sekunder sebagai iterasi berikutnya jika waktu tersisa. Lihat `checklist.md` untuk breakdown waktu per fase.
