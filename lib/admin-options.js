import bcrypt from "bcryptjs";
import { saveUpload } from "@/lib/upload";
import { prisma } from "@/lib/prisma";

/**
 * Upload handler untuk field bertipe "file" di NextAdmin.
 */
const uploadFile = async (buffer, infos) => {
  const name = infos?.name || infos?.filename || "upload";
  return saveUpload(buffer, name);
};

const imageField = {
  format: "file",
  handler: { upload: uploadFile }
};

/**
 * Bangun NextAdminOptions sesuai role pengguna.
 * ADMIN  : semua model.
 * AUTHOR : hanya melihat Category & Tag (read-only) — artikel lewat menu "Artikel".
 */
export function buildAdminOptions(user) {
  const isAdmin = user?.role === "ADMIN";

  const baseModel = {
    Post: {
      title: "Artikel",
      icon: "NewspaperIcon",
      toString: (p) => p.title,
      aliases: {
        title: "Judul",
        slug: "Slug",
        excerpt: "Kutipan",
        contentJson: "Isi Artikel",
        featuredImage: "Gambar Utama",
        status: "Status",
        seoTitle: "Judul SEO",
        seoDescription: "Deskripsi SEO",
        focusKeyword: "Kata Kunci Fokus"
      },
      list: {
        display: ["id", "title", "status", "updatedAt"],
        search: ["title", "excerpt"],
        filters: [
          { name: "Draft", active: false, value: { status: { equals: "DRAFT" } }, group: "status" },
          { name: "Menunggu", active: false, value: { status: { equals: "PENDING" } }, group: "status" },
          { name: "Terbit", active: false, value: { status: { equals: "PUBLISHED" } }, group: "status" }
        ],
        defaultListSize: 20
      },
      edit: {
        display: ["title", "slug", "excerpt", "contentJson", "featuredImage", "status", "seoTitle", "seoDescription", "focusKeyword"],
        fields: { contentJson: { format: "textarea" } }
      }
    },
    Category: {
      title: "Kategori",
      icon: "FolderIcon",
      toString: (c) => c.name,
      aliases: { name: "Nama", slug: "Slug" },
      list: { display: ["id", "name", "slug"], search: ["name"], defaultListSize: 20 },
      edit: { display: ["name", "slug"] }
    },
    Tag: {
      title: "Tag",
      icon: "TagIcon",
      toString: (t) => t.name,
      aliases: { name: "Nama", slug: "Slug" },
      list: { display: ["id", "name", "slug"], search: ["name"], defaultListSize: 20 },
      edit: { display: ["name", "slug"] }
    }
  };

  if (!isAdmin) {
    return {
      title: "CKS Admin",
      model: {
        Post: { ...baseModel.Post, permissions: [] },
        Category: { ...baseModel.Category, permissions: [] },
        Tag: { ...baseModel.Tag, permissions: [] }
      },
      externalLinks: [{ label: "Lihat Situs", url: "/" }],
      sidebar: {
        groups: [
          { title: "Konten", models: ["Post"] },
          { title: "Referensi", models: ["Category", "Tag"] }
        ]
      },
      defaultColorScheme: "light"
    };
  }

  return {
    title: "CKS Admin",
    model: {
      ...baseModel,
      Event: {
        title: "Event",
        icon: "CalendarDaysIcon",
        toString: (e) => e.title,
        aliases: {
          title: "Judul",
          slug: "Slug",
          shortDescription: "Deskripsi Singkat",
          location: "Lokasi",
          startAt: "Mulai",
          endAt: "Selesai",
          image: "Gambar",
          published: "Terbit"
        },
        list: {
          display: ["id", "title", "location", "startAt", "published"],
          search: ["title", "location", "shortDescription"],
          filters: [
            { name: "Terbit", active: false, value: { published: { equals: true } }, group: "pub" },
            { name: "Draft", active: false, value: { published: { equals: false } }, group: "pub" }
          ],
          defaultListSize: 20
        },
        // Editor custom di /admin/events — jangan tampilkan field Json di form NextAdmin
        edit: {
          display: ["title", "slug", "shortDescription", "location", "startAt", "endAt", "image", "published"],
          fields: {
            image: imageField,
            shortDescription: { format: "textarea" },
            startAt: { format: "date-time" },
            endAt: { format: "date-time" }
          }
        }
      },
      GalleryItem: {
        title: "Galeri",
        icon: "PhotoIcon",
        toString: (g) => g.title,
        aliases: {
          title: "Judul",
          caption: "Caption",
          image: "Media",
          mediaType: "Tipe",
          category: "Kategori",
          sortOrder: "Urutan",
          published: "Terbit"
        },
        list: {
          display: ["id", "image", "title", "mediaType", "category", "sortOrder", "published"],
          search: ["title", "caption"],
          filters: [
            { name: "Gambar", active: false, value: { mediaType: { equals: "IMAGE" } }, group: "media" },
            { name: "Video", active: false, value: { mediaType: { equals: "VIDEO" } }, group: "media" },
            { name: "Terbit", active: false, value: { published: { equals: true } }, group: "pub" }
          ],
          defaultListSize: 12
        },
        edit: {
          display: ["title", "caption", "mediaType", "image", "category", "sortOrder", "published"],
          fields: {
            image: imageField,
            caption: { format: "textarea" },
            mediaType: {
              helperText: "IMAGE untuk foto, VIDEO untuk video short (mp4)."
            }
          }
        }
      },
      Job: {
        title: "Lowongan",
        icon: "BriefcaseIcon",
        toString: (j) => `${j.posisi} — ${j.negara}`,
        aliases: {
          negara: "Negara",
          kode: "Kode",
          posisi: "Posisi",
          info: "Info",
          image: "Gambar",
          active: "Aktif",
          sortOrder: "Urutan"
        },
        list: {
          display: ["id", "negara", "kode", "posisi", "active", "sortOrder"],
          search: ["negara", "posisi"],
          filters: [
            { name: "Aktif", active: false, value: { active: { equals: true } }, group: "aktif" },
            { name: "Nonaktif", active: false, value: { active: { equals: false } }, group: "aktif" }
          ],
          defaultListSize: 20
        },
        edit: {
          display: ["negara", "kode", "posisi", "info", "image", "active", "sortOrder"],
          fields: { image: imageField, info: { format: "textarea" } }
        }
      },
      Branch: {
        title: "Cabang",
        icon: "BuildingOfficeIcon",
        toString: (b) => `${b.nama} (${b.kode})`,
        aliases: {
          kode: "Kode",
          nama: "Nama",
          alamat: "Alamat",
          telepon: "Telepon",
          active: "Aktif"
        },
        list: {
          display: ["id", "kode", "nama", "telepon", "active"],
          search: ["nama", "kode"],
          filters: [
            { name: "Aktif", active: false, value: { active: { equals: true } }, group: "aktif" },
            { name: "Nonaktif", active: false, value: { active: { equals: false } }, group: "aktif" }
          ],
          defaultListSize: 20
        },
        edit: {
          display: ["kode", "nama", "alamat", "telepon", "active"],
          fields: { alamat: { format: "textarea" } }
        }
      },
      Registration: {
        title: "Pendaftaran",
        icon: "ClipboardDocumentListIcon",
        toString: (r) => `${r.nomor} — ${r.nama}`,
        aliases: {
          nomor: "No. Pendaftaran",
          nama: "Nama",
          nik: "NIK",
          telepon: "Telepon",
          email: "Email",
          jenisKelamin: "Jenis Kelamin",
          pendidikan: "Pendidikan",
          negaraTujuan: "Negara Tujuan",
          kabKota: "Kab/Kota",
          catatan: "Catatan Pendaftar",
          status: "Status",
          notes: "Catatan Internal",
          createdAt: "Tanggal Daftar"
        },
        list: {
          display: ["nomor", "nama", "telepon", "negaraTujuan", "status", "createdAt"],
          search: ["nama", "nomor", "telepon", "nik", "email"],
          filters: [
            { name: "Baru", active: false, value: { status: { equals: "BARU" } }, group: "status" },
            { name: "Diproses", active: false, value: { status: { equals: "DIPROSES" } }, group: "status" },
            { name: "Diterima", active: false, value: { status: { equals: "DITERIMA" } }, group: "status" },
            { name: "Ditolak", active: false, value: { status: { equals: "DITOLAK" } }, group: "status" }
          ],
          defaultListSize: 20,
          defaultSort: { field: "createdAt", direction: "desc" }
        },
        edit: {
          display: [
            "nomor",
            "nama",
            "nik",
            "telepon",
            "email",
            "jenisKelamin",
            "pendidikan",
            "negaraTujuan",
            "kabKota",
            "catatan",
            "status",
            "notes",
            "createdAt"
          ],
          fields: {
            nomor: { disabled: true },
            nama: { disabled: true },
            nik: { disabled: true },
            telepon: { disabled: true },
            email: { disabled: true },
            jenisKelamin: { disabled: true },
            pendidikan: { disabled: true },
            negaraTujuan: { disabled: true },
            kabKota: { disabled: true },
            catatan: { format: "textarea", disabled: true },
            notes: { format: "textarea", helperText: "Catatan internal admin." },
            createdAt: { disabled: true }
          }
        },
        permissions: ["edit", "delete"]
      },
      Message: {
        title: "Pesan Masuk",
        icon: "InboxIcon",
        toString: (m) => `${m.nama} — ${m.telepon}`,
        aliases: {
          nama: "Nama",
          email: "Email",
          telepon: "Telepon",
          pesan: "Pesan",
          isRead: "Sudah Dibaca",
          createdAt: "Tanggal"
        },
        list: {
          display: ["id", "nama", "telepon", "pesan", "isRead", "createdAt"],
          search: ["nama", "telepon", "pesan", "email"],
          filters: [
            { name: "Belum dibaca", active: false, value: { isRead: { equals: false } }, group: "read" },
            { name: "Sudah dibaca", active: false, value: { isRead: { equals: true } }, group: "read" }
          ],
          defaultListSize: 20,
          defaultSort: { field: "createdAt", direction: "desc" },
          fields: {
            pesan: {
              formatter: (value) => {
                const text = String(value || "");
                return text.length > 80 ? `${text.slice(0, 80)}…` : text;
              }
            }
          }
        },
        // Isi pesan hanya dilihat; isRead boleh diubah. Tidak ada create.
        edit: {
          display: ["nama", "email", "telepon", "pesan", "isRead", "createdAt"],
          fields: {
            nama: { disabled: true },
            email: { disabled: true },
            telepon: { disabled: true },
            pesan: { format: "textarea", disabled: true },
            isRead: { helperText: "Tandai sudah dibaca setelah dibaca." },
            createdAt: { disabled: true }
          }
        },
        permissions: ["edit", "delete"]
      },
      User: {
        title: "Pengguna",
        icon: "UsersIcon",
        toString: (u) => `${u.name} (${u.email})`,
        aliases: {
          name: "Nama",
          email: "Email",
          password: "Password",
          role: "Role",
          createdAt: "Terdaftar"
        },
        list: {
          display: ["id", "name", "email", "role", "createdAt"],
          search: ["name", "email"],
          filters: [
            { name: "Admin", active: false, value: { role: { equals: "ADMIN" } }, group: "role" },
            { name: "Penulis", active: false, value: { role: { equals: "AUTHOR" } }, group: "role" }
          ],
          defaultListSize: 20
        },
        edit: {
          display: ["name", "email", "password", "role"],
          fields: {
            password: { format: "password" }
          },
          hooks: {
            async beforeDb(data, mode) {
              if (mode === "edit") {
                // Jangan hash ulang bila field berisi hash lama atau kosong.
                const current = data.id
                  ? await prisma.user.findUnique({
                      where: { id: Number(data.id) },
                      select: { password: true }
                    })
                  : null;
                if (!data.password || (current && data.password === current.password)) {
                  delete data.password;
                } else {
                  data.password = await bcrypt.hash(data.password, 10);
                }
              } else if (data.password) {
                data.password = await bcrypt.hash(data.password, 10);
              }
              if (data.email) data.email = String(data.email).toLowerCase();
              return data;
            }
          }
        }
      }
    },
    pages: {
      "/pengaturan": { title: "Pengaturan", icon: "Cog6ToothIcon" }
    },
    externalLinks: [{ label: "Lihat Situs", url: "/" }],
    sidebar: {
      groups: [
        { title: "Konten", models: ["Post", "GalleryItem", "Event"] },
        { title: "Referensi", models: ["Category", "Tag"] },
        { title: "Informasi", models: ["Job", "Branch"] },
        { title: "Masuk", models: ["Registration", "Message"] },
        { title: "Sistem", models: ["User"] }
      ]
    },
    defaultColorScheme: "light"
  };
}
