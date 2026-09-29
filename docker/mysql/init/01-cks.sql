-- MySQL dump 10.13  Distrib 8.4.11, for Linux (x86_64)
--
-- Host: localhost    Database: cks_web
-- ------------------------------------------------------
-- Server version	8.4.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `cks_web`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cks_web` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `cks_web`;

--
-- Table structure for table `Branch`
--

DROP TABLE IF EXISTS `Branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Branch` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `telepon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Branch_kode_key` (`kode`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Branch`
--

LOCK TABLES `Branch` WRITE;
/*!40000 ALTER TABLE `Branch` DISABLE KEYS */;
INSERT INTO `Branch` VALUES (1,'MDC','MANADO',NULL,NULL,1),(2,'CKSLBK','LOMBOK',NULL,NULL,1),(3,'CKS','Malang',NULL,NULL,1),(4,'CKSTA','Tulungagung',NULL,NULL,1),(5,'CKSBR','Brebes',NULL,NULL,1),(6,'CKSIMY','Indramayu',NULL,NULL,1),(7,'CKSPL','Palembang',NULL,NULL,1),(8,'CKSLPG','Lampung',NULL,NULL,1);
/*!40000 ALTER TABLE `Branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_slug_key` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'Panduan','panduan'),(2,'Dokumen','dokumen'),(3,'BLK & Pelatihan','blk-pelatihan'),(4,'Informasi','informasi');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Event`
--

DROP TABLE IF EXISTS `Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startAt` datetime(3) NOT NULL,
  `endAt` datetime(3) DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `longDescriptionHtml` longtext COLLATE utf8mb4_unicode_ci,
  `longDescriptionJson` json DEFAULT NULL,
  `shortDescription` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Event_slug_key` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Event`
--

LOCK TABLES `Event` WRITE;
/*!40000 ALTER TABLE `Event` DISABLE KEYS */;
INSERT INTO `Event` VALUES (1,'Sosialisasi & Pra-Pendaftaran CPMI','sosialisasi-pra-pendaftaran-cpmi','Kantor Pusat CKS ??? Malang','2026-10-13 02:15:39.251',NULL,'/demo/profil-kegiatan.jpg',1,'2026-09-29 02:15:39.264',NULL,NULL,NULL),(2,'Pembukaan Kelas BLK Gelombang Baru','pembukaan-kelas-blk-gelombang-baru','BLK CKS','2026-10-29 02:15:39.251','2026-10-29 06:15:39.251','/demo/blog-blk.jpg',1,'2026-09-29 02:15:39.264',NULL,NULL,NULL);
/*!40000 ALTER TABLE `Event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GalleryItem`
--

DROP TABLE IF EXISTS `GalleryItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GalleryItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Kegiatan',
  `sortOrder` int NOT NULL DEFAULT '0',
  `published` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `mediaType` enum('IMAGE','VIDEO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IMAGE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GalleryItem`
--

LOCK TABLES `GalleryItem` WRITE;
/*!40000 ALTER TABLE `GalleryItem` DISABLE KEYS */;
INSERT INTO `GalleryItem` VALUES (1,'Suasana kantor','Suasana kantor (foto ilustrasi)','/demo/hero.jpg','Fasilitas',1,1,'2026-09-29 02:15:39.063','IMAGE'),(2,'Kegiatan operasional','Kegiatan operasional (foto ilustrasi)','/demo/profil-kegiatan.jpg','Kegiatan',2,1,'2026-09-29 02:15:39.063','IMAGE'),(3,'Pelatihan BLK','Lingkungan pelatihan BLK (foto ilustrasi)','/demo/blog-blk.jpg','Kegiatan',3,1,'2026-09-29 02:15:39.063','IMAGE'),(4,'Administrasi dokumen','Administrasi dokumen (foto ilustrasi)','/demo/blog-dokumen.jpg','Kegiatan',4,1,'2026-09-29 02:15:39.063','IMAGE'),(5,'Alur administrasi','Alur administrasi (foto ilustrasi)','/demo/blog-izin.jpg','Kegiatan',5,1,'2026-09-29 02:15:39.063','IMAGE'),(6,'Destinasi Taiwan','Ilustrasi destinasi Taiwan','/demo/lowongan-taiwan.jpg','Destinasi',6,1,'2026-09-29 02:15:39.063','IMAGE'),(7,'Destinasi Hong Kong','Ilustrasi destinasi Hong Kong','/demo/lowongan-hongkong.jpg','Destinasi',7,1,'2026-09-29 02:15:39.063','IMAGE'),(8,'Destinasi Malaysia','Ilustrasi destinasi Malaysia','/demo/lowongan-malaysia.jpg','Destinasi',8,1,'2026-09-29 02:15:39.063','IMAGE'),(9,'Destinasi Singapura','Ilustrasi destinasi Singapura','/demo/lowongan-singapura.jpg','Destinasi',9,1,'2026-09-29 02:15:39.063','IMAGE');
/*!40000 ALTER TABLE `GalleryItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Job`
--

DROP TABLE IF EXISTS `Job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Job` (
  `id` int NOT NULL AUTO_INCREMENT,
  `negara` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `posisi` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `sortOrder` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Job`
--

LOCK TABLES `Job` WRITE;
/*!40000 ALTER TABLE `Job` DISABLE KEYS */;
INSERT INTO `Job` VALUES (1,'Taiwan','TW','Caregiver / Perawat lansia','Pengalaman merawat lansia diutamakan; usia umum 21???40 tahun.','/demo/lowongan-taiwan.jpg',1,1),(2,'Taiwan','TW','Operator pabrik','Sektor manufaktur; kesehatan baik dan siap kerja shift.','/demo/lowongan-taiwan-pabrik.jpg',1,2),(3,'Hong Kong','HK','Pekerja rumah tangga (PRT)','Pengalaman domestic helper atau pelatihan sebelumnya membantu.','/demo/lowongan-hongkong.jpg',1,3),(4,'Hong Kong','HK','Perawat lansia / baby sitter','Syarat mengikuti ketentuan agen & partner destinasi.','/demo/lowongan-hongkong-care.jpg',1,4),(5,'Malaysia','MY','Operator produksi','Informasi lowongan sektor industri; detail diperjelas saat wawancara.','/demo/lowongan-malaysia.jpg',1,5),(6,'Singapura','SG','Staff hotel / F&B','Contoh minat sektor jasa; seleksi sesuai kebutuhan mitra.','/demo/lowongan-singapura.jpg',1,6);
/*!40000 ALTER TABLE `Job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telepon` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pesan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Message`
--

LOCK TABLES `Message` WRITE;
/*!40000 ALTER TABLE `Message` DISABLE KEYS */;
INSERT INTO `Message` VALUES (1,'Tes User','tes@mail.com','08123456789','Halo, ini pesan uji.',0,'2026-09-29 02:39:07.051');
/*!40000 ALTER TABLE `Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PageView`
--

DROP TABLE IF EXISTS `PageView`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PageView` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `referrer` text COLLATE utf8mb4_unicode_ci,
  `userAgent` text COLLATE utf8mb4_unicode_ci,
  `visitor` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `PageView_createdAt_idx` (`createdAt`),
  KEY `PageView_path_idx` (`path`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageView`
--

LOCK TABLES `PageView` WRITE;
/*!40000 ALTER TABLE `PageView` DISABLE KEYS */;
INSERT INTO `PageView` VALUES (1,'/',NULL,'node','7927790ef76a4b95d26689608e2cae1f','2026-09-29 02:38:58.402'),(2,'/',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','e71eb4049aa2905eb2dc87ae31e04fe2','2026-09-29 02:57:45.248'),(3,'/',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','e71eb4049aa2905eb2dc87ae31e04fe2','2026-09-29 02:59:04.255'),(4,'/event',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','e71eb4049aa2905eb2dc87ae31e04fe2','2026-09-29 02:59:05.527'),(5,'/event/pembukaan-kelas-blk-gelombang-baru',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','e71eb4049aa2905eb2dc87ae31e04fe2','2026-09-29 02:59:06.964'),(6,'/event/pembukaan-kelas-blk-gelombang-baru',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','e71eb4049aa2905eb2dc87ae31e04fe2','2026-09-29 03:29:43.528'),(7,'/event/pembukaan-kelas-blk-gelombang-baru',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','e71eb4049aa2905eb2dc87ae31e04fe2','2026-09-29 03:29:44.887'),(8,'/event',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','e71eb4049aa2905eb2dc87ae31e04fe2','2026-09-29 03:29:55.740'),(9,'/event/sosialisasi-pra-pendaftaran-cpmi',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','e71eb4049aa2905eb2dc87ae31e04fe2','2026-09-29 03:30:04.434'),(10,'/cabang',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','e71eb4049aa2905eb2dc87ae31e04fe2','2026-09-29 03:30:08.096'),(11,'/blog',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','e71eb4049aa2905eb2dc87ae31e04fe2','2026-09-29 03:30:11.282'),(12,'/',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/3.20.17 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36','527cd3532070f75915876945c00011f6','2026-09-29 05:08:03.676'),(13,'/galeri',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','ccfba8bf86347b7599d1226c6f13640f','2026-09-29 05:26:06.422'),(14,'/galeri',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','ccfba8bf86347b7599d1226c6f13640f','2026-09-29 05:26:29.236');
/*!40000 ALTER TABLE `PageView` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Post`
--

DROP TABLE IF EXISTS `Post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `contentJson` json DEFAULT NULL,
  `contentHtml` longtext COLLATE utf8mb4_unicode_ci,
  `featuredImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('DRAFT','PENDING','PUBLISHED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `seoTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDescription` text COLLATE utf8mb4_unicode_ci,
  `focusKeyword` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `authorId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Post_slug_key` (`slug`),
  KEY `Post_authorId_fkey` (`authorId`),
  CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Post`
--

LOCK TABLES `Post` WRITE;
/*!40000 ALTER TABLE `Post` DISABLE KEYS */;
INSERT INTO `Post` VALUES (1,'Cara menyiapkan dokumen CPMI sebelum proses berlanjut','menyiapkan-dokumen-cpmi','Ringkasan dokumen yang biasanya diminta sejak awal, agar data pribadi dan berkas pendukung lebih rapi.','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Calon Pekerja Migran Indonesia (CPMI) biasanya diminta menyiapkan identitas dan berkas pendukung sejak tahap awal. Mulailah dari KTP, kartu keluarga, dan data kontak yang masih aktif agar petugas mudah menghubungi Anda.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"content\": [{\"text\": \"Siapkan juga dokumen pendidikan terakhir yang Anda miliki, serta catatan pengalaman kerja jika ada. Pastikan nama di setiap berkas sama dengan nama di KTP untuk menghindari perbaikan berulang.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"content\": [{\"text\": \"Simpan salinan digital yang jelas (bukan foto buram) di satu folder. Jika ada perubahan alamat atau nomor telepon, segera perbarui agar proses administrasi tidak tertunda.\", \"type\": \"text\"}]}]}','<p>Calon Pekerja Migran Indonesia (CPMI) biasanya diminta menyiapkan identitas dan berkas pendukung sejak tahap awal. Mulailah dari KTP, kartu keluarga, dan data kontak yang masih aktif agar petugas mudah menghubungi Anda.</p>\n<p>Siapkan juga dokumen pendidikan terakhir yang Anda miliki, serta catatan pengalaman kerja jika ada. Pastikan nama di setiap berkas sama dengan nama di KTP untuk menghindari perbaikan berulang.</p>\n<p>Simpan salinan digital yang jelas (bukan foto buram) di satu folder. Jika ada perubahan alamat atau nomor telepon, segera perbarui agar proses administrasi tidak tertunda.</p>','/demo/blog-dokumen.jpg','PUBLISHED','Cara menyiapkan dokumen CPMI sebelum proses berlanjut','Ringkasan dokumen yang biasanya diminta sejak awal, agar data pribadi dan berkas pendukung lebih rapi.',NULL,'2026-09-10 00:00:00.000',1,'2026-09-29 02:15:38.911','2026-09-29 02:15:38.911'),(2,'Apa itu BLK dalam proses penempatan?','apa-itu-blk','Penjelasan singkat tentang peran Balai Latihan Kerja (BLK) bagi peserta sebelum keberangkatan.','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"BLK atau Balai Latihan Kerja adalah fasilitas pelatihan yang dipakai untuk mempersiapkan peserta. Di lingkungan operasional CKS, BLK menjadi bagian dari tahapan sebelum peserta lanjut ke proses keberangkatan.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"content\": [{\"text\": \"Kegiatan di BLK umumnya mencakup penyampaian materi, latihan keterampilan, serta administrasi peserta. Jadwal dan aturan mengikuti kebijakan internal lembaga serta ketentuan yang berlaku.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"content\": [{\"text\": \"Jika Anda dijadwalkan masuk BLK, datang tepat waktu, bawa identitas, dan ikuti arahan petugas. Komunikasi yang jelas dengan instruktur atau staf membantu proses berjalan lebih tertib.\", \"type\": \"text\"}]}]}','<p>BLK atau Balai Latihan Kerja adalah fasilitas pelatihan yang dipakai untuk mempersiapkan peserta. Di lingkungan operasional CKS, BLK menjadi bagian dari tahapan sebelum peserta lanjut ke proses keberangkatan.</p>\n<p>Kegiatan di BLK umumnya mencakup penyampaian materi, latihan keterampilan, serta administrasi peserta. Jadwal dan aturan mengikuti kebijakan internal lembaga serta ketentuan yang berlaku.</p>\n<p>Jika Anda dijadwalkan masuk BLK, datang tepat waktu, bawa identitas, dan ikuti arahan petugas. Komunikasi yang jelas dengan instruktur atau staf membantu proses berjalan lebih tertib.</p>','/demo/blog-blk.jpg','PUBLISHED','Apa itu BLK dalam proses penempatan?','Penjelasan singkat tentang peran Balai Latihan Kerja (BLK) bagi peserta sebelum keberangkatan.',NULL,'2026-09-15 00:00:00.000',1,'2026-09-29 02:15:38.962','2026-09-29 02:15:38.962'),(3,'Gambaran umum alur izin pulang peserta','alur-izin-pulang-umum','Penjelasan umum tahapan izin pulang di lingkungan pelatihan, tanpa mengklaim prosedur resmi pemerintah.','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Izin pulang biasanya diajukan ketika peserta perlu meninggalkan lokasi pelatihan untuk sementara. Secara umum, pengajuan dimulai dari permintaan peserta, lalu diperiksa oleh petugas terkait.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"content\": [{\"text\": \"Dalam praktik operasional, izin sering melewati beberapa tahapan persetujuan internal sebelum peserta diizinkan keluar. Setiap lembaga dapat memiliki urutan paraf yang berbeda sesuai kebijakan setempat.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"content\": [{\"text\": \"Peserta sebaiknya menunggu status izin jelas sebelum meninggalkan lokasi. Saat kembali, ikuti prosedur pencatatan masuk yang ditentukan petugas agar absensi dan administrasi tetap akurat.\", \"type\": \"text\"}]}]}','<p>Izin pulang biasanya diajukan ketika peserta perlu meninggalkan lokasi pelatihan untuk sementara. Secara umum, pengajuan dimulai dari permintaan peserta, lalu diperiksa oleh petugas terkait.</p>\n<p>Dalam praktik operasional, izin sering melewati beberapa tahapan persetujuan internal sebelum peserta diizinkan keluar. Setiap lembaga dapat memiliki urutan paraf yang berbeda sesuai kebijakan setempat.</p>\n<p>Peserta sebaiknya menunggu status izin jelas sebelum meninggalkan lokasi. Saat kembali, ikuti prosedur pencatatan masuk yang ditentukan petugas agar absensi dan administrasi tetap akurat.</p>','/demo/blog-izin.jpg','PUBLISHED','Gambaran umum alur izin pulang peserta','Penjelasan umum tahapan izin pulang di lingkungan pelatihan, tanpa mengklaim prosedur resmi pemerintah.',NULL,'2026-09-20 00:00:00.000',1,'2026-09-29 02:15:38.993','2026-09-29 02:15:38.993');
/*!40000 ALTER TABLE `Post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Registration`
--

DROP TABLE IF EXISTS `Registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Registration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nomor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nik` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telepon` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenisKelamin` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pendidikan` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `negaraTujuan` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kabKota` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `status` enum('BARU','DIPROSES','DITERIMA','DITOLAK') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BARU',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Registration_nomor_key` (`nomor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Registration`
--

LOCK TABLES `Registration` WRITE;
/*!40000 ALTER TABLE `Registration` DISABLE KEYS */;
/*!40000 ALTER TABLE `Registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Setting`
--

DROP TABLE IF EXISTS `Setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `section` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Setting_key_key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Setting`
--

LOCK TABLES `Setting` WRITE;
/*!40000 ALTER TABLE `Setting` DISABLE KEYS */;
INSERT INTO `Setting` VALUES (1,'siteTitle','CKS ??? PT Citra Karya Sejati','general'),(2,'tagline','Penempatan Calon Pekerja Migran Indonesia (CPMI)','general'),(3,'metaDescription','PT Citra Karya Sejati (CKS) ??? informasi penempatan CPMI, pelatihan BLK, dan administrasi dokumen.','general'),(4,'address','','kontak'),(5,'phone','','kontak'),(6,'whatsapp','','kontak'),(7,'email','','kontak'),(8,'mapsEmbedUrl','','kontak'),(9,'workHours','Senin???Jumat 08.00???16.00, Sabtu 08.00???12.00','kontak'),(10,'facebook','','sosial'),(11,'instagram','','sosial'),(12,'tiktok','','sosial'),(13,'youtube','','sosial'),(14,'gaMeasurementId','','integrasi'),(15,'gscVerification','','integrasi'),(16,'robotsIndex','1','integrasi');
/*!40000 ALTER TABLE `Setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tag`
--

DROP TABLE IF EXISTS `Tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tag_slug_key` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tag`
--

LOCK TABLES `Tag` WRITE;
/*!40000 ALTER TABLE `Tag` DISABLE KEYS */;
INSERT INTO `Tag` VALUES (1,'Cpmi','cpmi'),(2,'Blk','blk'),(3,'Dokumen','dokumen'),(4,'Penempatan','penempatan'),(5,'Taiwan','taiwan'),(6,'Hong Kong','hong-kong');
/*!40000 ALTER TABLE `Tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','AUTHOR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AUTHOR',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'Administrator','admin@cks.id','$2b$10$DH1BF1CahFvNjqwXtxDxL.kCp7d2g0rU7UZ.rka.N9Nz4WqEb6Mbe','ADMIN','2026-09-29 02:15:38.282'),(2,'Redaksi','redaksi@cks.id','$2b$10$yKyGr9YnZTUAgLh8rVsdvec2zLuCDtYTXhAmk/2.DuyOsKq7A7L.2','AUTHOR','2026-09-29 02:15:38.580');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_CategoryToPost`
--

DROP TABLE IF EXISTS `_CategoryToPost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_CategoryToPost` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_CategoryToPost_AB_unique` (`A`,`B`),
  KEY `_CategoryToPost_B_index` (`B`),
  CONSTRAINT `_CategoryToPost_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_CategoryToPost_B_fkey` FOREIGN KEY (`B`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_CategoryToPost`
--

LOCK TABLES `_CategoryToPost` WRITE;
/*!40000 ALTER TABLE `_CategoryToPost` DISABLE KEYS */;
INSERT INTO `_CategoryToPost` VALUES (1,1),(2,1),(3,2),(4,2),(4,3);
/*!40000 ALTER TABLE `_CategoryToPost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_PostToTag`
--

DROP TABLE IF EXISTS `_PostToTag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_PostToTag` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_PostToTag_AB_unique` (`A`,`B`),
  KEY `_PostToTag_B_index` (`B`),
  CONSTRAINT `_PostToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_PostToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_PostToTag`
--

LOCK TABLES `_PostToTag` WRITE;
/*!40000 ALTER TABLE `_PostToTag` DISABLE KEYS */;
INSERT INTO `_PostToTag` VALUES (1,1),(2,1),(2,2),(3,2),(1,3),(3,4);
/*!40000 ALTER TABLE `_PostToTag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('40f253a8-4f07-4b2f-bd7c-52eff8bb05f4','312b0d48352ba9a50521aab9937c34eef19ce4d7c1a580682c0a0c4777b20873',NULL,'20260929040000_gallery_media_type','A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260929040000_gallery_media_type\n\nDatabase error code: 1064\n\nDatabase error:\nYou have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \'???-- AlterTable\nALTER TABLE `GalleryItem` ADD COLUMN `mediaType` ENUM(\'IMAGE\', \' at line 1\n\nPlease check the query number 1 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20260929040000_gallery_media_type\"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name=\"20260929040000_gallery_media_type\"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:260','2026-09-29 04:14:38.171','2026-09-29 04:14:18.693',0),('47fcf48f-243c-453c-a699-f8e9508f560b','312b0d48352ba9a50521aab9937c34eef19ce4d7c1a580682c0a0c4777b20873',NULL,'20260929040000_gallery_media_type','A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260929040000_gallery_media_type\n\nDatabase error code: 1064\n\nDatabase error:\nYou have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \'???-- AlterTable\nALTER TABLE `GalleryItem` ADD COLUMN `mediaType` ENUM(\'IMAGE\', \' at line 1\n\nPlease check the query number 1 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20260929040000_gallery_media_type\"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name=\"20260929040000_gallery_media_type\"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:260','2026-09-29 04:14:56.346','2026-09-29 04:14:42.504',0),('886ba501-a198-4f5a-b4a6-bd2129a54662','ef2ea3bf96bd589bfa1243115fba218af60b4b4de3dd82364eb56b59f0ab59e5',NULL,'20260929040000_gallery_media_type','A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260929040000_gallery_media_type\n\nDatabase error code: 1060\n\nDatabase error:\nDuplicate column name \'mediaType\'\n\nPlease check the query number 1 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20260929040000_gallery_media_type\"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name=\"20260929040000_gallery_media_type\"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:260','2026-09-29 04:15:09.727','2026-09-29 04:15:01.168',0),('9599cd04-443d-4b15-b428-6da9a0489a66','ef2ea3bf96bd589bfa1243115fba218af60b4b4de3dd82364eb56b59f0ab59e5','2026-09-29 04:15:09.736','20260929040000_gallery_media_type','',NULL,'2026-09-29 04:15:09.736',0),('c923ca5d-e78b-49a9-a75d-c239c4e8180e','69d36e3f75801704f6da59b26f4ed406edd74d0551b4b4ea47b0c64f096ca21f','2026-09-29 02:14:23.611','20260929021421_init',NULL,NULL,'2026-09-29 02:14:21.481',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'cks_web'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-29  6:05:27
