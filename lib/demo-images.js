/**
 * Pemetaan slot gambar demo → path lokal.
 * Ganti file di public/demo dengan nama yang sama — layout tidak perlu diubah.
 */
export const DEMO_IMAGES = {
  hero: "/demo/hero.jpg",
  profil: "/demo/profil-kegiatan.jpg",
  lowongan: {
    "tw-caregiver": "/demo/lowongan-taiwan.jpg",
    "tw-pabrik": "/demo/lowongan-taiwan-pabrik.jpg",
    "hk-prt": "/demo/lowongan-hongkong.jpg",
    "hk-care": "/demo/lowongan-hongkong-care.jpg",
    "my-pabrik": "/demo/lowongan-malaysia.jpg",
    "sg-hotel": "/demo/lowongan-singapura.jpg"
  },
  blog: {
    "menyiapkan-dokumen-cpmi": "/demo/blog-dokumen.jpg",
    "apa-itu-blk": "/demo/blog-blk.jpg",
    "alur-izin-pulang-umum": "/demo/blog-izin.jpg"
  }
};

export function getLowonganImage(jobId) {
  return DEMO_IMAGES.lowongan[jobId] || DEMO_IMAGES.hero;
}

export function getBlogImage(slug) {
  return DEMO_IMAGES.blog[slug] || DEMO_IMAGES.hero;
}
