export const COMPANY = {
  brand: "CKS",
  legalName: "PT Citra Karya Sejati",
  tagline: "Penempatan Calon Pekerja Migran Indonesia (CPMI)",
  contactNote: "Kontak kantor belum dilengkapi",
  services: [
    {
      title: "Proses penempatan CPMI",
      body: "Pendampingan alur penempatan dari pendaftaran hingga tahapan operasional di sistem CKS."
    },
    {
      title: "Pelatihan BLK",
      body: "Fasilitas Balai Latihan Kerja (BLK) untuk persiapan peserta sebelum keberangkatan."
    },
    {
      title: "Administrasi dokumen",
      body: "Pengelolaan biodata, medical, visa, dan dokumen pendukung dalam proses penempatan."
    }
  ]
};

/** Menu utama (navbar + footer) — CTA Daftar terpisah di Header. */
export const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/layanan", label: "Layanan" },
  { href: "/lowongan", label: "Lowongan" },
  { href: "/galeri", label: "Galeri" },
  { href: "/event", label: "Event" },
  { href: "/cabang", label: "Cabang" },
  { href: "/blog", label: "Blog" },
  { href: "/kontak", label: "Kontak" }
];

/** Infografis alur CPMI lengkap ada di components/AlurProses.js (SVG/CSS orisinal CKS). */

/**
 * Cabang aktif dari master datacabang (API lokal) — hanya nama/kode; alamat kosong tidak dikarang.
 */
export const CABANG_LIST = [
  { kode: "MDC", nama: "MANADO" },
  { kode: "CKSLBK", nama: "LOMBOK" },
  { kode: "CKS", nama: "Malang" },
  { kode: "CKSTA", nama: "Tulungagung" },
  { kode: "CKSBR", nama: "Brebes" },
  { kode: "CKSIMY", nama: "Indramayu" },
  { kode: "CKSPL", nama: "Palembang" },
  { kode: "CKSLPG", nama: "Lampung" }
];

/** Foto ilustrasi galeri — dari public/demo, bukan klaim peserta CKS. */
export const GALERI_ITEMS = [
  {
    src: "/demo/hero.jpg",
    caption: "Suasana kantor (foto ilustrasi)"
  },
  {
    src: "/demo/profil-kegiatan.jpg",
    caption: "Kegiatan operasional (foto ilustrasi)"
  },
  {
    src: "/demo/blog-blk.jpg",
    caption: "Lingkungan pelatihan BLK (foto ilustrasi)"
  },
  {
    src: "/demo/blog-dokumen.jpg",
    caption: "Administrasi dokumen (foto ilustrasi)"
  },
  {
    src: "/demo/blog-izin.jpg",
    caption: "Alur administrasi (foto ilustrasi)"
  },
  {
    src: "/demo/lowongan-taiwan.jpg",
    caption: "Ilustrasi destinasi Taiwan"
  },
  {
    src: "/demo/lowongan-hongkong.jpg",
    caption: "Ilustrasi destinasi Hong Kong"
  },
  {
    src: "/demo/lowongan-malaysia.jpg",
    caption: "Ilustrasi destinasi Malaysia"
  },
  {
    src: "/demo/lowongan-singapura.jpg",
    caption: "Ilustrasi destinasi Singapura"
  }
];

/** Informasi lowongan — bukan klaim slot resmi tersisa. */
export const LOWONGAN_CONTOH = [
  {
    id: "tw-caregiver",
    negara: "Taiwan",
    kode: "TW",
    posisi: "Caregiver / Perawat lansia",
    info: "Pengalaman merawat lansia diutamakan; usia umum 21–40 tahun."
  },
  {
    id: "tw-pabrik",
    negara: "Taiwan",
    kode: "TW",
    posisi: "Operator pabrik",
    info: "Sektor manufaktur; kesehatan baik dan siap kerja shift."
  },
  {
    id: "hk-prt",
    negara: "Hong Kong",
    kode: "HK",
    posisi: "Pekerja rumah tangga (PRT)",
    info: "Pengalaman domestic helper atau pelatihan sebelumnya membantu."
  },
  {
    id: "hk-care",
    negara: "Hong Kong",
    kode: "HK",
    posisi: "Perawat lansia / baby sitter",
    info: "Syarat mengikuti ketentuan agen & partner destinasi."
  },
  {
    id: "my-pabrik",
    negara: "Malaysia",
    kode: "MY",
    posisi: "Operator produksi",
    info: "Informasi lowongan sektor industri; detail diperjelas saat wawancara."
  },
  {
    id: "sg-hotel",
    negara: "Singapura",
    kode: "SG",
    posisi: "Staff hotel / F&B",
    info: "Contoh minat sektor jasa; seleksi sesuai kebutuhan mitra."
  }
];

export const FAQ_ITEMS = [
  {
    q: "Siapa yang bisa mendaftar sebagai CPMI?",
    a: "Warga negara Indonesia yang memenuhi syarat usia, kesehatan, dan dokumen sesuai ketentuan penempatan serta destinasi yang diminati."
  },
  {
    q: "Apakah lowongan di beranda slot resmi yang tersisa?",
    a: "Tidak. Kartu di beranda menampilkan informasi lowongan (negara dan posisi umum). Ketersediaan dan syarat aktual dikonfirmasi melalui proses pendaftaran dan wawancara."
  },
  {
    q: "Bagaimana cara daftar lewat website ini?",
    a: "Isi formulir di halaman Daftar CPMI. Data tersimpan sementara di perangkat Anda (localStorage) dan belum otomatis masuk ke server operasional CKS."
  },
  {
    q: "Apa peran BLK dalam proses?",
    a: "Balai Latihan Kerja (BLK) mempersiapkan peserta sebelum keberangkatan melalui pelatihan dan administrasi peserta sesuai kebijakan lembaga."
  },
  {
    q: "Dokumen apa yang biasanya disiapkan lebih dulu?",
    a: "KTP, kartu keluarga, data kontak aktif, dan dokumen pendidikan. Pastikan nama di berkas sama dengan KTP."
  },
  {
    q: "Apakah alamat dan telepon kantor sudah tertera?",
    a: "Kontak kantor belum dilengkapi di profil. Hubungi petugas CKS melalui saluran resmi yang sudah Anda kenal."
  }
];

export const BLOG_POSTS = [
  {
    slug: "menyiapkan-dokumen-cpmi",
    title: "Cara menyiapkan dokumen CPMI sebelum proses berlanjut",
    date: "2026-09-10",
    excerpt:
      "Ringkasan dokumen yang biasanya diminta sejak awal, agar data pribadi dan berkas pendukung lebih rapi.",
    paragraphs: [
      "Calon Pekerja Migran Indonesia (CPMI) biasanya diminta menyiapkan identitas dan berkas pendukung sejak tahap awal. Mulailah dari KTP, kartu keluarga, dan data kontak yang masih aktif agar petugas mudah menghubungi Anda.",
      "Siapkan juga dokumen pendidikan terakhir yang Anda miliki, serta catatan pengalaman kerja jika ada. Pastikan nama di setiap berkas sama dengan nama di KTP untuk menghindari perbaikan berulang.",
      "Simpan salinan digital yang jelas (bukan foto buram) di satu folder. Jika ada perubahan alamat atau nomor telepon, segera perbarui agar proses administrasi tidak tertunda."
    ]
  },
  {
    slug: "apa-itu-blk",
    title: "Apa itu BLK dalam proses penempatan?",
    date: "2026-09-15",
    excerpt:
      "Penjelasan singkat tentang peran Balai Latihan Kerja (BLK) bagi peserta sebelum keberangkatan.",
    paragraphs: [
      "BLK atau Balai Latihan Kerja adalah fasilitas pelatihan yang dipakai untuk mempersiapkan peserta. Di lingkungan operasional CKS, BLK menjadi bagian dari tahapan sebelum peserta lanjut ke proses keberangkatan.",
      "Kegiatan di BLK umumnya mencakup penyampaian materi, latihan keterampilan, serta administrasi peserta. Jadwal dan aturan mengikuti kebijakan internal lembaga serta ketentuan yang berlaku.",
      "Jika Anda dijadwalkan masuk BLK, datang tepat waktu, bawa identitas, dan ikuti arahan petugas. Komunikasi yang jelas dengan instruktur atau staf membantu proses berjalan lebih tertib."
    ]
  },
  {
    slug: "alur-izin-pulang-umum",
    title: "Gambaran umum alur izin pulang peserta",
    date: "2026-09-20",
    excerpt:
      "Penjelasan umum tahapan izin pulang di lingkungan pelatihan, tanpa mengklaim prosedur resmi pemerintah.",
    paragraphs: [
      "Izin pulang biasanya diajukan ketika peserta perlu meninggalkan lokasi pelatihan untuk sementara. Secara umum, pengajuan dimulai dari permintaan peserta, lalu diperiksa oleh petugas terkait.",
      "Dalam praktik operasional, izin sering melewati beberapa tahapan persetujuan internal sebelum peserta diizinkan keluar. Setiap lembaga dapat memiliki urutan paraf yang berbeda sesuai kebijakan setempat.",
      "Peserta sebaiknya menunggu status izin jelas sebelum meninggalkan lokasi. Saat kembali, ikuti prosedur pencatatan masuk yang ditentukan petugas agar absensi dan administrasi tetap akurat."
    ]
  }
];

export function getPost(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug) || null;
}
