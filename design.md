# Design Document — Peka

## 1. Prinsip Desain

- **Hangat, bukan klinis** — hindari kesan seperti aplikasi medis/rumah sakit. Gunakan bahasa sehari-hari, bukan istilah psikologi formal.
- **Card-based & visual** — Gen Z terbiasa dengan interface berbasis kartu (mirip Instagram Story/BeReal), bukan form panjang.
- **Cepat & minim friksi** — proses input mood sampai dapat saran harus terasa instan (< 1 menit total).
- **Menenangkan tapi tetap hidup** — palet warna lembut namun tidak membosankan, dibantu animasi halus.

## 2. Palet Warna per Mood

Setiap mood punya warna identitas sendiri supaya riwayat mood mudah dikenali sekilas secara visual (scannable):

| Mood | Warna | Rasional |
|---|---|---|
| Kewalahan | Oranye lembut | Warna hangat, menandakan "penuh/sesak" tanpa terasa alarm |
| Cemas | Ungu muda | Netral-tenang, tidak seagresif merah |
| Kesal | Merah muda dusty | Tetap terasa "panas" tapi tidak vulgar |
| Sedih | Biru muda | Asosiasi umum, mudah dikenali |
| Capek | Abu-abu kehijauan | Warna "low energy" yang tenang |

Alasan tidak pakai warna primer terang: aplikasi ini soal refleksi diri, bukan produk yang harus "berteriak" — warna dipilih agar terasa aman dan tidak menghakimi.

## 3. Alur Pengguna (User Flow)

```
1. Landing/Login
   └─ Email/magic link via Supabase Auth
2. Home — Mood Check-in
   └─ Pilih 1 dari 5 kartu mood (visual, bukan dropdown)
   └─ Isi 1-2 kalimat pemicu (input bebas, placeholder contoh)
   └─ Tap "Kirim"
3. AI Response Screen
   └─ Tampilkan micro-intervention hasil generate LLM (2 menit read)
   └─ Tombol "Membantu" / "Kurang membantu"
   └─ CTA: "Simpan & lihat riwayat"
4. Riwayat/Dashboard
   └─ List mood entries terbaru → terlama
   └─ (Jika sempat) Chart sederhana pola mood mingguan
5. Mood Recap Card (fitur sekunder)
   └─ Generate 1 gambar ringkasan mood minggu ini
   └─ Tombol download untuk share manual ke IG Story
```

## 4. Komponen Utama

- `MoodPicker` — grid 5 kartu mood dengan ikon/warna masing-masing, animasi scale-up saat dipilih
- `TriggerInput` — text area kecil dengan placeholder contoh ("abis dimarahin bos soal deadline...")
- `AIResponseCard` — kartu hasil saran dari LLM, dengan animasi fade-in supaya terasa seperti "dikirim langsung", bukan muncul instan/kaku
- `HistoryList` — list riwayat mood, tiap item pakai warna sesuai mood-nya
- `RecapCardGenerator` — komponen yang di-render lalu di-convert jadi gambar (html-to-image)
- `ReminderBanner` — banner halus di top halaman home, muncul kondisional kalau user belum cek-in > 2 hari

## 5. Rasional Keputusan Desain (untuk dijelaskan ke juri)

- **Kenapa card-based, bukan form biasa?** Karena target user (Gen Z) lebih familiar dan lebih cepat berinteraksi dengan elemen visual dibanding form teks panjang — mengurangi friksi di titik paling kritis (saat orang sedang tidak mood mengisi form ribet).
- **Kenapa warna per mood, bukan 1 warna tema tunggal?** Supaya riwayat mood bisa "dibaca" sekilas tanpa perlu baca teks satu-satu — pattern recognition visual lebih cepat dari membaca.
- **Kenapa animasi difokuskan di AI Response Screen?** Momen paling emosional dalam flow adalah saat user menerima balasan — animasi halus di titik ini membuat interaksi terasa lebih personal dan "didengar", bukan sekadar transaksi data.
- **Kenapa reminder di dalam app, bukan push notification?** Selain pertimbangan waktu development, secara UX ini juga menghindari kesan "menuntut/mengganggu" yang justru kontraproduktif untuk aplikasi kesehatan mental — reminder muncul saat user membuka app dengan kesadarannya sendiri.

## 6. Tone of Voice (copywriting)

- Gunakan bahasa santai, orang kedua ("kamu"), hindari jargon klinis
- Hindari kalimat menghakimi atau terlalu positif-toxic ("selalu semangat ya!") — gunakan validasi terlebih dahulu sebelum saran
- Disclaimer etis tetap ditampilkan halus di footer, tidak mengganggu flow utama
