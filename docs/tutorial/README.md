# Tutorial Lengkap Admin CKS

Video tutorial **semua menu admin beserta fungsinya** — termasuk **praktek
pengisian** (mengetik di form), direkam dengan **Electron (offscreen)** dan
dinarasikan **Gemini TTS (voice: Leda)**.

## Prinsip: narasi dulu, baru video

Supaya penjelasan **pas dengan adegannya**, durasi tiap scene dihitung dari
audio narasinya:

```
durasi klip = jeda awal (0,6s) + durasi audio narasi + jeda akhir (0,9s)
```

Setiap scene direkam sebagai **klip terpisah**, lalu ditempeli narasinya
masing-masing, baru digabung jadi satu video.

```
audio/<id>.wav ──► hitung durasi ──► target durasi scene
                                        │
                    Electron merekam klip per scene (clips/<id>.mp4)
                                        │
        clips/<id>.mp4 + audio/<id>.wav ──► scenes/<id>.mp4  (narasi pas per scene)
                                        │
                              concat ──► tutorial-lengkap.mp4
```

## Hasil

| Berkas | Keterangan |
|--------|-----------|
| **`tutorial-lengkap.mp4`** | Video final (semua scene, narasi Leda) |

## 26 scene

### Admin — beserta praktek pengisian
| # | Menu | Praktek yang diperlihatkan |
|---|------|----------------------------|
| 01 | Login | Fokus ke kolom email & kata sandi |
| 02 | Dashboard | Ringkasan statistik & grafik |
| 03 | Slider Beranda | **Ketik** Judul, Subjudul, Label & Tautan tombol |
| 04 | Artikel (daftar) | Filter status |
| 05 | Artikel (editor) | **Ketik judul + isi artikel** di editor blok |
| 06 | Galeri | **Ketik Judul & Caption** di form tambah media |
| 07 | Event | **Ketik judul & deskripsi** event |
| 08 | Kategori | Kelola pengelompokan artikel |
| 09 | Tag | Label spesifik artikel |
| 10 | Lowongan | **Ketik Negara & Posisi** |
| 11 | Cabang | Daftar kantor cabang |
| 12 | Pendaftaran | Data pendaftar & ubah status |
| 13 | Pesan Masuk | Buka detail pesan |
| 14 | Pengguna | Akun & peran (Admin/Penulis) |
| 15 | Pengaturan | **Ketik Telepon & WhatsApp** |

### Halaman publik
16 Beranda · 17 Profil · 18 Layanan · 19 Lowongan · 20 Galeri · 21 Event ·
22 Cabang · 23 Blog + detail · 24 Kontak · **25 Daftar CPMI (ketik formulir)** · 26 Penutup

## Cara membuat ulang

```powershell
# 0. Aplikasi harus jalan (npm run dev) + MySQL hidup

# 1. Narasi (Gemini TTS - Leda)
$env:GOOGLE_API_KEY = "<kunci>"
$env:GEMINI_TTS_VOICE = "Leda"
$env:GEMINI_TTS_MODEL = "gemini-3.8-flash-tts"
node scripts/tutorial/generate-tts.mjs

# 2. Rekam per scene (Electron offscreen)
cd scripts\tutorial\electron
npx electron main.js
cd ..\..\..

# 3. Tempel narasi per scene + gabung
node scripts/tutorial/assemble-scenes.mjs
```

Uji sebagian scene saja:

```powershell
cd scripts\tutorial\electron
$env:ONLY = "03-slider,05-artikel-editor"
npx electron main.js
```

## Berkas

| Berkas | Kategori |
|--------|----------|
| `naskah.json` | Teks narasi 26 scene |
| `audio/` | Narasi WAV per scene (Gemini TTS) |
| `clips/` + `clips.json` | Klip rekaman per scene + metadatanya |
| `scenes/` | Klip + narasi per scene (sebelum digabung) |
| `tutorial-lengkap.mp4` | **Video final** |
| `../../scripts/tutorial/electron/main.js` | Perekam + skenario + praktek pengisian |
| `../../scripts/tutorial/generate-tts.mjs` | Generator narasi |
| `../../scripts/tutorial/assemble-scenes.mjs` | Penempel narasi + penggabung |

## Catatan

- Perekam berjalan **tanpa jendela terlihat** (offscreen) sehingga bisa
  dijalankan di latar belakang.
- Overlay dev Next.js disembunyikan agar rekaman bersih
  (`devIndicators: false` + injeksi CSS).
- Ukuran frame mengikuti area kerja layar mesin perekam.
- **Jangan commit kunci API.** Set hanya lewat environment.
