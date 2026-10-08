/* eslint-disable */
/**
 * Seed awal database — idempotent (upsert by key unik).
 * Jalankan: node prisma/seed.js
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEMO = {
  hero: "/demo/hero.jpg",
  profil: "/demo/profil-kegiatan.jpg",
  blogDokumen: "/demo/blog-dokumen.jpg",
  blogBlk: "/demo/blog-blk.jpg",
  blogIzin: "/demo/blog-izin.jpg",
  taiwan: "/demo/lowongan-taiwan.jpg",
  taiwanPabrik: "/demo/lowongan-taiwan-pabrik.jpg",
  hongkong: "/demo/lowongan-hongkong.jpg",
  hongkongCare: "/demo/lowongan-hongkong-care.jpg",
  malaysia: "/demo/lowongan-malaysia.jpg",
  singapura: "/demo/lowongan-singapura.jpg"
};

function docFromParagraphs(paragraphs) {
  return {
    type: "doc",
    content: paragraphs.map((p) => ({
      type: "paragraph",
      content: [{ type: "text", text: p }]
    }))
  };
}

function htmlFromParagraphs(paragraphs) {
  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n");
}

async function main() {
  // ——— Users ———
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@cks.id").toLowerCase();
  const authorEmail = (process.env.AUTHOR_EMAIL || "redaksi@cks.id").toLowerCase();

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || "Administrator",
      email: adminEmail,
      password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin123", 10),
      role: "ADMIN"
    }
  });

  const author = await prisma.user.upsert({
    where: { email: authorEmail },
    update: {},
    create: {
      name: process.env.AUTHOR_NAME || "Redaksi",
      email: authorEmail,
      password: bcrypt.hashSync(process.env.AUTHOR_PASSWORD || "redaksi123", 10),
      role: "AUTHOR"
    }
  });

  // ——— Kategori & Tag ———
  const categoryDefs = [
    { name: "Panduan", slug: "panduan" },
    { name: "Dokumen", slug: "dokumen" },
    { name: "BLK & Pelatihan", slug: "blk-pelatihan" },
    { name: "Informasi", slug: "informasi" }
  ];
  const categories = {};
  for (const c of categoryDefs) {
    categories[c.slug] = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c
    });
  }

  const tagDefs = ["cpmi", "blk", "dokumen", "penempatan", "taiwan", "hong-kong"];
  const tags = {};
  for (const t of tagDefs) {
    tags[t] = await prisma.tag.upsert({
      where: { slug: t },
      update: {},
      create: { name: t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), slug: t }
    });
  }

  // ——— Artikel blog ———
  const posts = [
    {
      slug: "menyiapkan-dokumen-cpmi",
      title: "Cara menyiapkan dokumen CPMI sebelum proses berlanjut",
      excerpt:
        "Ringkasan dokumen yang biasanya diminta sejak awal, agar data pribadi dan berkas pendukung lebih rapi.",
      featuredImage: DEMO.blogDokumen,
      publishedAt: new Date("2026-09-10"),
      categories: ["dokumen", "panduan"],
      tags: ["cpmi", "dokumen"],
      paragraphs: [
        "Calon Pekerja Migran Indonesia (CPMI) biasanya diminta menyiapkan identitas dan berkas pendukung sejak tahap awal. Mulailah dari KTP, kartu keluarga, dan data kontak yang masih aktif agar petugas mudah menghubungi Anda.",
        "Siapkan juga dokumen pendidikan terakhir yang Anda miliki, serta catatan pengalaman kerja jika ada. Pastikan nama di setiap berkas sama dengan nama di KTP untuk menghindari perbaikan berulang.",
        "Simpan salinan digital yang jelas (bukan foto buram) di satu folder. Jika ada perubahan alamat atau nomor telepon, segera perbarui agar proses administrasi tidak tertunda."
      ]
    },
    {
      slug: "apa-itu-blk",
      title: "Apa itu BLK dalam proses penempatan?",
      excerpt:
        "Penjelasan singkat tentang peran Balai Latihan Kerja (BLK) bagi peserta sebelum keberangkatan.",
      featuredImage: DEMO.blogBlk,
      publishedAt: new Date("2026-09-15"),
      categories: ["blk-pelatihan", "informasi"],
      tags: ["cpmi", "blk"],
      paragraphs: [
        "BLK atau Balai Latihan Kerja adalah fasilitas pelatihan yang dipakai untuk mempersiapkan peserta. Di lingkungan operasional CKS, BLK menjadi bagian dari tahapan sebelum peserta lanjut ke proses keberangkatan.",
        "Kegiatan di BLK umumnya mencakup penyampaian materi, latihan keterampilan, serta administrasi peserta. Jadwal dan aturan mengikuti kebijakan internal lembaga serta ketentuan yang berlaku.",
        "Jika Anda dijadwalkan masuk BLK, datang tepat waktu, bawa identitas, dan ikuti arahan petugas. Komunikasi yang jelas dengan instruktur atau staf membantu proses berjalan lebih tertib."
      ]
    },
    {
      slug: "alur-izin-pulang-umum",
      title: "Gambaran umum alur izin pulang peserta",
      excerpt:
        "Penjelasan umum tahapan izin pulang di lingkungan pelatihan, tanpa mengklaim prosedur resmi pemerintah.",
      featuredImage: DEMO.blogIzin,
      publishedAt: new Date("2026-09-20"),
      categories: ["informasi"],
      tags: ["blk", "penempatan"],
      paragraphs: [
        "Izin pulang biasanya diajukan ketika peserta perlu meninggalkan lokasi pelatihan untuk sementara. Secara umum, pengajuan dimulai dari permintaan peserta, lalu diperiksa oleh petugas terkait.",
        "Dalam praktik operasional, izin sering melewati beberapa tahapan persetujuan internal sebelum peserta diizinkan keluar. Setiap lembaga dapat memiliki urutan paraf yang berbeda sesuai kebijakan setempat.",
        "Peserta sebaiknya menunggu status izin jelas sebelum meninggalkan lokasi. Saat kembali, ikuti prosedur pencatatan masuk yang ditentukan petugas agar absensi dan administrasi tetap akurat."
      ]
    }
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        contentJson: docFromParagraphs(p.paragraphs),
        contentHtml: htmlFromParagraphs(p.paragraphs),
        featuredImage: p.featuredImage,
        status: "PUBLISHED",
        publishedAt: p.publishedAt,
        seoTitle: p.title,
        seoDescription: p.excerpt,
        authorId: admin.id,
        categories: { connect: p.categories.map((slug) => ({ slug })) },
        tags: { connect: p.tags.map((slug) => ({ slug })) }
      }
    });
  }

  // ——— Lowongan ———
  const jobs = [
    { negara: "Taiwan", kode: "TW", posisi: "Caregiver / Perawat lansia", info: "Pengalaman merawat lansia diutamakan; usia umum 21–40 tahun.", image: DEMO.taiwan, sortOrder: 1 },
    { negara: "Taiwan", kode: "TW", posisi: "Operator pabrik", info: "Sektor manufaktur; kesehatan baik dan siap kerja shift.", image: DEMO.taiwanPabrik, sortOrder: 2 },
    { negara: "Hong Kong", kode: "HK", posisi: "Pekerja rumah tangga (PRT)", info: "Pengalaman domestic helper atau pelatihan sebelumnya membantu.", image: DEMO.hongkong, sortOrder: 3 },
    { negara: "Hong Kong", kode: "HK", posisi: "Perawat lansia / baby sitter", info: "Syarat mengikuti ketentuan agen & partner destinasi.", image: DEMO.hongkongCare, sortOrder: 4 },
    { negara: "Malaysia", kode: "MY", posisi: "Operator produksi", info: "Informasi lowongan sektor industri; detail diperjelas saat wawancara.", image: DEMO.malaysia, sortOrder: 5 },
    { negara: "Singapura", kode: "SG", posisi: "Staff hotel / F&B", info: "Contoh minat sektor jasa; seleksi sesuai kebutuhan mitra.", image: DEMO.singapura, sortOrder: 6 }
  ];
  const jobCount = await prisma.job.count();
  if (jobCount === 0) {
    await prisma.job.createMany({ data: jobs });
  }

  // ——— Galeri ———
  const gallery = [
    { title: "Suasana kantor", caption: "Suasana kantor (foto ilustrasi)", image: DEMO.hero, category: "Fasilitas", sortOrder: 1 },
    { title: "Kegiatan operasional", caption: "Kegiatan operasional (foto ilustrasi)", image: DEMO.profil, category: "Kegiatan", sortOrder: 2 },
    { title: "Pelatihan BLK", caption: "Lingkungan pelatihan BLK (foto ilustrasi)", image: DEMO.blogBlk, category: "Kegiatan", sortOrder: 3 },
    { title: "Administrasi dokumen", caption: "Administrasi dokumen (foto ilustrasi)", image: DEMO.blogDokumen, category: "Kegiatan", sortOrder: 4 },
    { title: "Alur administrasi", caption: "Alur administrasi (foto ilustrasi)", image: DEMO.blogIzin, category: "Kegiatan", sortOrder: 5 },
    { title: "Destinasi Taiwan", caption: "Ilustrasi destinasi Taiwan", image: DEMO.taiwan, category: "Destinasi", sortOrder: 6 },
    { title: "Destinasi Hong Kong", caption: "Ilustrasi destinasi Hong Kong", image: DEMO.hongkong, category: "Destinasi", sortOrder: 7 },
    { title: "Destinasi Malaysia", caption: "Ilustrasi destinasi Malaysia", image: DEMO.malaysia, category: "Destinasi", sortOrder: 8 },
    { title: "Destinasi Singapura", caption: "Ilustrasi destinasi Singapura", image: DEMO.singapura, category: "Destinasi", sortOrder: 9 }
  ];
  const galleryCount = await prisma.galleryItem.count();
  if (galleryCount === 0) {
    await prisma.galleryItem.createMany({ data: gallery });
  }

  // ——— Slider beranda ———
  const heroCount = await prisma.heroSlide.count();
  if (heroCount === 0) {
    await prisma.heroSlide.createMany({
      data: [
        {
          title: "Penempatan CPMI terarah",
          subtitle: "Pendampingan dari minat lowongan hingga persiapan dokumen dan BLK.",
          image: DEMO.hero,
          ctaLabel: "Daftar CPMI",
          ctaHref: "/daftar",
          sortOrder: 1
        },
        {
          title: "Siap menuju Taiwan",
          subtitle: "Contoh minat caregiver, pabrik, dan sektor informal.",
          image: DEMO.taiwan,
          ctaLabel: "Lihat lowongan",
          ctaHref: "/lowongan",
          sortOrder: 2
        },
        {
          title: "Peluang di Hong Kong",
          subtitle: "Informasi umum PRT dan perawat lansia — detail saat daftar.",
          image: DEMO.hongkong,
          ctaLabel: "Daftar CPMI",
          ctaHref: "/daftar",
          sortOrder: 3
        },
        {
          title: "Malaysia & Singapura",
          subtitle: "Contoh minat produksi dan jasa untuk calon pekerja migran.",
          image: DEMO.malaysia,
          ctaLabel: "Daftar CPMI",
          ctaHref: "/daftar",
          sortOrder: 4
        }
      ]
    });
  }

  // ——— Cabang ———
  const branches = [
    { kode: "MDC", nama: "MANADO" },
    { kode: "CKSLBK", nama: "LOMBOK" },
    { kode: "CKS", nama: "Malang" },
    { kode: "CKSTA", nama: "Tulungagung" },
    { kode: "CKSBR", nama: "Brebes" },
    { kode: "CKSIMY", nama: "Indramayu" },
    { kode: "CKSPL", nama: "Palembang" },
    { kode: "CKSLPG", nama: "Lampung" }
  ];
  for (const b of branches) {
    await prisma.branch.upsert({ where: { kode: b.kode }, update: {}, create: b });
  }

  // ——— Event ———
  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: "Sosialisasi & Pra-Pendaftaran CPMI",
          slug: "sosialisasi-pra-pendaftaran-cpmi",
          shortDescription:
            "Sesi informasi terbuka tentang alur penempatan CPMI, dokumen yang perlu disiapkan, dan tanya jawab dengan tim CKS.",
          longDescriptionJson: {
            type: "doc",
            content: [{ type: "paragraph", content: [{ type: "text", text: "Sesi informasi terbuka tentang alur penempatan CPMI, dokumen yang perlu disiapkan, dan tanya jawab langsung dengan tim CKS. Pastikan membawa KTP dan dokumen dasar lainnya." }] }]
          },
          longDescriptionHtml:
            "<p>Sesi informasi terbuka tentang alur penempatan CPMI, dokumen yang perlu disiapkan, dan tanya jawab langsung dengan tim CKS. Pastikan membawa KTP dan dokumen dasar lainnya.</p>",
          location: "Kantor Pusat CKS — Malang",
          startAt: new Date(Date.now() + 14 * 86400000),
          image: DEMO.profil,
          published: true
        },
        {
          title: "Pembukaan Kelas BLK Gelombang Baru",
          slug: "pembukaan-kelas-blk-gelombang-baru",
          shortDescription:
            "Pembukaan kelas pelatihan di Balai Latihan Kerja untuk peserta yang sudah lolos tahap administrasi awal.",
          longDescriptionJson: {
            type: "doc",
            content: [{ type: "paragraph", content: [{ type: "text", text: "Pembukaan kelas pelatihan di Balai Latihan Kerja untuk peserta yang sudah lolos tahap administrasi awal. Pelatihan mencakup bahasa dasar, etika kerja, dan persiapan dokumen." }] }]
          },
          longDescriptionHtml:
            "<p>Pembukaan kelas pelatihan di Balai Latihan Kerja untuk peserta yang sudah lolos tahap administrasi awal. Pelatihan mencakup bahasa dasar, etika kerja, dan persiapan dokumen.</p>",
          location: "BLK CKS",
          startAt: new Date(Date.now() + 30 * 86400000),
          endAt: new Date(Date.now() + 30 * 86400000 + 4 * 3600000),
          image: DEMO.blogBlk,
          published: true
        }
      ]
    });
  }

  // ——— Settings default ———
  const settingDefaults = [
    ["siteTitle", "CKS — PT Citra Karya Sejati", "general"],
    ["tagline", "Penempatan Calon Pekerja Migran Indonesia (CPMI)", "general"],
    ["metaDescription", "PT Citra Karya Sejati (CKS) — informasi penempatan CPMI, pelatihan BLK, dan administrasi dokumen.", "general"],
    ["address", "", "kontak"],
    ["phone", "", "kontak"],
    ["whatsapp", "", "kontak"],
    ["email", "", "kontak"],
    ["mapsEmbedUrl", "", "kontak"],
    ["workHours", "Senin–Jumat 08.00–16.00, Sabtu 08.00–12.00", "kontak"],
    ["facebook", "", "sosial"],
    ["instagram", "", "sosial"],
    ["tiktok", "", "sosial"],
    ["youtube", "", "sosial"],
    ["gaMeasurementId", "", "integrasi"],
    ["gscVerification", "", "integrasi"],
    ["robotsIndex", "1", "integrasi"]
  ];
  for (const [key, value, section] of settingDefaults) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value, section }
    });
  }

  console.log("Seed selesai.");
  console.log(`Admin  : ${adminEmail} (id=${admin.id})`);
  console.log(`Author : ${authorEmail} (id=${author.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
