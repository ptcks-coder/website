# Rancangan Video Tutorial (Browser + Screen Record)

Dokumen ini merancang cara membuat video tutorial admin CKS dengan memanfaatkan
**otomasi browser** dan **perekaman layar**. Contoh kasus: mengelola **Slider Beranda**.

---

## 1. Tujuan & cakupan

- **Tujuan**: video langkah-demi-langkah yang mudah diikuti petugas/admin CKS.
- **Target durasi**: 2–4 menit per topik.
- **Resolusi**: 1920×1080, 30 fps, MP4 (H.264 + AAC).
- **Topik awal**:
  1. Mengelola **Slider Beranda** (tambah/ubah/hapus/urutkan).
  2. Mengelola **Artikel** (tulis, gambar utama, SEO, terbit).
  3. Mengelola **Galeri** dan **Event**.

---

## 2. Alat yang tersedia

| Kebutuhan | Alat | Catatan |
|-----------|------|---------|
| Menggerakkan demo | **Browser otomasi** (Chromium) | `navigate`, `fill`, `click`, `screenshot` — deterministik, tanpa salah klik |
| Rekam layar | **ffmpeg `gdigrab`** | sudah terpasang (`ffmpeg.exe`) |
| Alternatif rekam | **Windows Game Bar** (Win+G) | bawaan Windows 11 |
| Menyusun video | **ffmpeg** | rangkai gambar, tambah audio, subtitle |
| Narasi | Mic + Audacity/ffmpeg, atau TTS | opsional |
| Subtitle | SRT + ffmpeg `subtitles=` | opsional |

---

## 3. Tiga pendekatan (pilih sesuai kebutuhan)

### A. Screen record + otomasi browser (paling natural)
Jalankan otomasi browser menggerakkan UI, sementara ffmpeg merekam layar.

```bash
# mulai rekam (layar penuh)
ffmpeg -f gdigrab -framerate 30 -i desktop -c:v libx264 -pix_fmt yuv420p -crf 20 rekaman.mp4
# ... jalankan demo, lalu tekan q untuk berhenti
```
- ✅ Pergerakan kursor & animasi asli
- ❌ tergantung kecepatan eksekusi; perlu latihan agar tempo pas

### B. Screenshot per langkah → rangkai jadi video (paling deterministik)
Ambil **screenshot tiap langkah** via browser otomasi, lalu susun durasi + narasi.

```bash
# daftar (nama file + durasi detik)
cat > frames.txt <<'EOF'
file '01-intro.png'
duration 3
file '02-login.png'
duration 3
file '03-menu-slider.png'
duration 4
EOF
ffmpeg -f concat -safe 0 -i frames.txt -vsync vfr -pix_fmt yuv420p -c:v libx264 -crf 18 tutorial.mp4
```
- ✅ Sangat rapi & bisa diulang; mudah diperbarui saat UI berubah
- ❌ tanpa animasi kursor (bisa ditambah overlay)

### C. Hibrida (disarankan)
- **Screenshot** untuk slide statis/penjelasan (intro, ringkasan).
- **Screen record** untuk interaksi (mengetik, mengunggah, klik).
- Gabung dengan ffmpeg + narasi.

---

## 4. Storyboard — "Mengelola Slider Beranda"

| # | Scene | Aksi di layar | Narasi (contoh) | Sumber |
|---|-------|---------------|-----------------|--------|
| 1 | Intro | Judul + logo CKS | "Di tutorial ini kita akan mengelola slider beranda." | slide |
| 2 | Login | Buka `/admin/login`, isi kredensial | "Masuk ke panel admin CKS." | record |
| 3 | Buka menu | Sidebar → **Konten → Slider Beranda** | "Menu Slider Beranda ada di grup Konten." | record |
| 4 | Tambah slide | Klik **Add +**, isi Judul, Subjudul | "Tambahkan slide baru, isi judul dan subjudul." | record |
| 5 | Unggah gambar | Klik field **Gambar** → pilih file | "Unggah gambar banner (maks 10MB)." | record |
| 6 | Tombol & urutan | Isi **Label/Tautan tombol**, **Urutan**, **Terbit** | "Atur teks tombol, tautan, urutan, dan status." | record |
| 7 | Simpan | Klik **Save/Create** | "Simpan." | record |
| 8 | Cek beranda | Buka `/` → slider berubah | "Slider beranda langsung menampilkan slide baru." | record |
| 9 | Edit/hapus | Kembali ke daftar → Edit/Hapus | "Slide bisa diedit, diurutkan, atau dihapus." | record |
| 10 | Outro | Ringkasan + logo | "Selesai. Selamat mencoba." | slide |

---

## 5. Struktur folder produksi

```
tutorial/
  01-slider/
    naskah.md            # narasi per scene
    frames/              # screenshot per langkah (01-*.png …)
    frames.txt           # daftar + durasi untuk ffmpeg concat
    rekaman.mp4          # hasil screen record (opsional)
    narasi.wav           # audio narasi (opsional)
    subtitle.srt         # opsional
    tutorial-slider.mp4  # hasil akhir
```

---

## 6. Langkah produksi

1. **Siapkan data demo** — reset/seed DB agar tampilan konsisten.
2. **Ambil materi**:
   - Jalankan otomasi browser → `browser.screenshot` tiap langkah (folder `frames/`).
   - (Opsional) rekam layar dengan ffmpeg `gdigrab`.
3. **Tulis narasi** (`naskah.md`) & rekam audio (`narasi.wav`).
4. **Susun video**:
   ```bash
   # rangkai screenshot
   ffmpeg -f concat -safe 0 -i frames.txt -vsync vfr -pix_fmt yuv420p slides.mp4
   # gabung dengan narasi
   ffmpeg -i slides.mp4 -i narasi.wav -c:v libx264 -c:a aac -shortest tutorial-slider.mp4
   ```
5. **Tambah subtitle** (opsional):
   ```bash
   ffmpeg -i tutorial-slider.mp4 -vf "subtitles=subtitle.srt" -c:a copy final.mp4
   ```
6. **Review & ekspor** final 1080p.

---

## 7. Konvensi kualitas

- **Highlight kursor**: overlay lingkaran di posisi klik (bisa digambar di post-process atau aktifkan di Game Bar).
- **Zoom**: potong/zoom area penting (mis. field Gambar) agar terbaca.
- **Tempo**: jeda ±1 detik sebelum/sesudah klik penting.
- **Konsisten**: resolusi & font sama antar video; intro/outro seragam.
- **Aksesibilitas**: sediakan subtitle Bahasa Indonesia.

---

## 8. Otomasi tangkapan layar (opsional, reproducible)

Untuk hasil yang bisa diulang, buat skrip Playwright yang menggerakkan alur dan
menyimpan screenshot per langkah:

```js
// scripts/capture-tutorial.mjs (konsep)
import { chromium } from "playwright";
const steps = [
  { name: "03-menu-slider", run: async (p) => p.getByText("Slider Beranda").click() },
  { name: "04-tambah", run: async (p) => p.getByText("Add").click() }
];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
// ... login, lalu loop steps: jalankan aksi + page.screenshot({ path: `frames/${name}.png` })
```

> Alternatif tanpa Playwright: gunakan **browser otomasi sesi ini** untuk
> menangkap screenshot per langkah secara langsung.

---

## 9. Rekomendasi

Mulai dari **Pendekatan C (Hibrida)** untuk topik **Slider Beranda**:
- Cepat diproduksi.
- Rapi dan mudah diperbarui ketika UI admin berubah.

---

## 10. Implementasi: rekam dengan Electron (offscreen)

Pendekatan screenshot-diam **diganti** dengan **perekaman layar sungguhan**
memakai Electron, karena pendekatan gambar statis memotong isi halaman.

```
Electron (offscreen, 30 fps, 1366×720)
   ├─ recording.mp4        rekaman layar (tanpa jendela terlihat)
   └─ timing.json          waktu tiap scene (berbasis NOMOR FRAME)

naskah.json → Gemini TTS (voice Leda) → audio/*.wav
   └─ timing.json + audio → narasi.wav
        └─ recording.mp4 + narasi.wav → tutorial-lengkap.mp4
```

**Kenapa berbasis nomor frame?** Kalau encoder tertinggal dan ada frame yang
tertunda, `startFrame / fps` tetap memberi posisi waktu yang tepat, sehingga
narasi tidak pernah bergeser.

### Konfigurasi Gemini

| Variabel | Nilai |
|----------|-------|
| `GOOGLE_API_KEY` | (environment, jangan di-commit) |
| `GEMINI_TTS_MODEL` | `gemini-3.8-flash-tts` |
| `GEMINI_TTS_VOICE` | **Leda** |
| `GEMINI_OCR_MODEL` | `gemini-3.5-flash-lite` |

> **OCR** (`gemini-3.5-flash-lite`) tersedia untuk membaca teks pada frame —
> mis. verifikasi label atau caption otomatis. Pada produksi ini naskah disusun
> manual agar alurnya natural.

### Skrip

| Skrip | Fungsi |
|-------|--------|
| `scripts/tutorial/electron/main.js` | Perekam Electron (offscreen) + menjalankan skenario 26 scene |
| `scripts/tutorial/generate-tts.mjs` | Narasi per scene via Gemini TTS (Leda) |
| `scripts/tutorial/assemble-video.mjs` | Bangun trek narasi + gabung video |

### Hasil

`docs/tutorial/tutorial-lengkap.mp4` — 1366×720, 30 fps, ±4 menit 58 detik,
mencakup **semua menu admin beserta fungsinya** dan halaman publik.
Detail: `docs/tutorial/README.md`.
