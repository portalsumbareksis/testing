# KENDEVSEC — Digital Studio Website

Website layanan IT, konsultasi keamanan digital yang etis, dan social media growth. Dibuat sebagai website statis yang bisa dipasang di GitHub Pages, dengan Firebase untuk admin login dan data dinamis.

## Fitur
- Responsive layout untuk HP, tablet, dan desktop.
- Background animasi partikel/starfield, aurora, grid, orbital rings, dan efek hover.
- Efek suara tombol yang dapat diaktifkan pengunjung.
- Pemutar DJ dengan tombol Play/Pause. Audio telah dikonversi menjadi MP3 standar agar kompatibilitas browser lebih baik. Browser tidak mengizinkan autoplay tanpa interaksi pengguna; pengunjung harus mengetuk tombol DJ PLAY.
- Form order dengan ringkasan otomatis yang membuka WhatsApp.
- Halaman Admin Login di `admin.html`.
- Setelah Firebase disiapkan: admin dapat mengedit pengaturan website, nomor WhatsApp, maintenance mode, serta tambah/edit/hapus dan menyembunyikan layanan.
- Maintenance mode dikelola dari admin panel.

## File penting
- `index.html` — halaman publik.
- `styles.css` — tampilan dan animasi.
- `app.js` — interaksi, audio, form order, starfield, Firebase loader.
- `admin.html` / `admin.js` — halaman login dan pengelolaan.
- `firebase-config.js` — konfigurasi Firebase milik Anda.
- `firestore.rules` — contoh aturan keamanan Firestore.
- `assets/dj-intro.mp3` — audio yang diputar melalui tombol DJ.

## Setup Firebase (wajib untuk admin login yang berfungsi)
Admin login sengaja tidak memiliki password bawaan atau login palsu. Untuk alasan keamanan, Firebase perlu dikonfigurasi sebelum login bisa dipakai.

1. Buat project di Firebase Console: https://console.firebase.google.com/
2. Tambahkan aplikasi Web dan salin konfigurasi yang diberikan.
3. Buka `firebase-config.js`, lalu ganti semua nilai `GANTI_...` dengan nilai konfigurasi project Anda. Jangan masukkan private service-account key ke file website.
4. Di Firebase Console → Authentication → Sign-in method, aktifkan **Email/Password**.
5. Di Authentication → Users, pilih Add user dan buat email/password khusus admin. Jangan gunakan password yang mudah ditebak.
6. Buat database Firestore di Build → Firestore Database.
7. Buka `firestore.rules`, ganti `GANTI_DENGAN_EMAIL_ADMIN_ANDA` dengan email admin yang sama persis, lalu publikasikan rules tersebut dari Firestore → Rules. Jika Anda memakai email berbeda, pastikan rules diperbarui sebelum mengelola data.
8. Buka website dan tekan **ADMIN LOGIN** atau langsung kunjungi `admin.html`, lalu login menggunakan akun yang dibuat di langkah 5.

> Penting: jika Firebase belum dikonfigurasi, halaman login tetap terlihat, tetapi pengiriman login dan dashboard tidak dapat bekerja. Ini disengaja agar tidak ada password demo yang tidak aman.

## Deploy di GitHub Pages dari HP Android
1. Ekstrak `KENDEVSEC-website.zip` di aplikasi pengelola ZIP.
2. Buat repository GitHub baru, misalnya `kendevsec-website`.
3. Upload **isi folder KENDEVSEC**, bukan file ZIP-nya saja. Pastikan `index.html`, `app.js`, `styles.css`, `admin.html`, `admin.js`, `firebase-config.js`, `firestore.rules`, `README.md`, dan folder `assets/` (termasuk `dj-intro.mp3`) berada di root repository.
4. Di repository buka Settings → Pages. Pada Build and deployment pilih Deploy from a branch, pilih branch `main` dan folder `/ (root)`, lalu Save.
5. Tunggu proses deployment selesai, kemudian buka URL Pages yang diberikan GitHub.
6. Untuk Firebase Authentication di hosting, tambahkan domain GitHub Pages Anda ke Authentication → Settings → Authorized domains.

## Catatan audio
File yang diterima awalnya merupakan audio AAC dalam kontainer MP4 meski berekstensi `.mp3`. File telah dikonversi menjadi MP3 standar dan diuji formatnya. Jangan mengganti nama file audio tanpa memperbarui `index.html`. Setelah upload, periksa URL file `assets/dj-intro.mp3` di browser. Musik hanya mulai setelah pengguna menekan DJ PLAY karena pembatasan autoplay browser dan Android.

## Catatan keamanan & batasan
- Website statis tidak boleh menyimpan secret/private key di frontend.
- Firebase API key web adalah konfigurasi aplikasi, bukan pengganti Firestore Rules.
- Gunakan email admin khusus dan rules dengan email yang dibatasi seperti contoh di atas.
- Jangan bagikan kredensial admin ke orang lain. Untuk produksi dengan kebutuhan akses yang lebih kompleks, gunakan custom claims atau backend server untuk otorisasi yang lebih kuat.
- Website ini tidak memproses pembayaran otomatis; order diselesaikan melalui WhatsApp.
- Pastikan Anda memiliki izin untuk menggunakan audio yang diunggah pada website publik.
