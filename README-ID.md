# WartegTrack AI — panduan iPhone

Aplikasi PWA untuk log makan lokal, estimasi makanan dari foto menggunakan OpenAI, saran makan, dan impor catatan latihan.

## Fitur yang benar-benar ada
- PWA yang dapat ditambahkan ke Home Screen iPhone.
- Foto makanan dikirim ke `/api/analyze`; backend memanggil model vision dan mengembalikan estimasi kalori/protein/karbohidrat/lemak per item.
- AI Coach menggunakan catatan makan dan latihan yang tersedia untuk memberi saran.
- Log disimpan pada `localStorage` browser. Ekspor JSON dan hapus lokal.
- Impor latihan JSON/CSV untuk dipakai AI Coach.

## Penting tentang Hevy
Integrasi langsung Hevy API **belum aktif** di paket ini. Ini sengaja agar tidak mengarang skema API atau membocorkan kredensial. Saat ini gunakan impor file workout JSON/CSV. Integrasi langsung memerlukan API key Hevy dan implementasi endpoint sesuai dokumentasi akun/API yang tersedia. Jika ditambahkan, API key harus menjadi environment variable server (mis. `HEVY_API_KEY`) dan dipanggil dari backend saja.

## Deploy lewat iPhone (tanpa Mac)
Anda memerlukan akun GitHub dan Vercel, serta OpenAI API key. Penggunaan API bisa berbiaya; atur budget/limit di akun penyedia.

1. Ekstrak ZIP di aplikasi Files.
2. Buat repository GitHub. Untuk privasi, gunakan **Private** jika akun/flow deployment mendukungnya. Unggah semua file dan folder dari ZIP, termasuk folder `api`. Jangan pernah commit `.env` atau API key.
3. Buka Vercel dan impor repository tersebut sebagai project. Framework preset: Other; Root Directory `./`; biarkan build command kosong/default.
4. Di Vercel Project → Settings → Environment Variables, tambahkan:
   - `OPENAI_API_KEY` = API key milikmu (server-only; jangan beri awalan `NEXT_PUBLIC_` atau `VITE_`)
   - `OPENAI_MODEL` = `gpt-4.1-mini` (opsional; default sudah sama)
5. Deploy / redeploy setelah environment variables disimpan. Buka URL Vercel yang diberikan.
6. Di Safari iPhone: Share → Add to Home Screen.

## Cara pakai
1. Foto makanan dengan pencahayaan jelas, usahakan semua lauk terlihat.
2. Tambahkan catatan porsi jika tahu (contoh: 2 centong nasi, ayam paha).
3. Tekan Analisis foto. Periksa hasilnya; koreksi porsi secara mental/di catatan sebelum menyimpan.
4. Buka AI Coach untuk saran makan praktis.
5. Masukkan file workout dari Hevy lewat Pengaturan → Impor data latihan.

## Keamanan dan keterbatasan
- API key hanya berada di Vercel Environment Variables. Jangan tempel key ke `index.html`, GitHub, chat, atau tangkapan layar.
- Backend ini belum punya autentikasi pengguna/rate limiting. Untuk penggunaan pribadi, jaga URL dan pertimbangkan proteksi akses sebelum dibagikan. API key tidak terlihat di frontend, tetapi endpoint publik bisa disalahgunakan dan menimbulkan biaya jika URL diketahui orang lain. Tambahkan autentikasi/rate limit sebelum pemakaian publik.
- Foto dikirim ke penyedia AI untuk dianalisis; jangan mengunggah foto yang memuat informasi pribadi sensitif.
- Catatan makan tersimpan lokal pada browser/perangkat; menghapus data browser dapat menghilangkannya. Ekspor secara berkala.
- Perkiraan kalori dan makro dari gambar tidak presisi, terutama minyak, ukuran porsi, kuah, saus, dan bahan tersembunyi.
- PWA ini tidak membaca Apple Health/HealthKit. iOS web app tidak mendapatkan akses HealthKit langsung.
- Belum ada login, cloud sync, database server, atau integrasi langsung Hevy API.
