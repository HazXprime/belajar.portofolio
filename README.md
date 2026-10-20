# Full-Stack CMS Developer Portfolio

A production-ready, full-stack personal portfolio and Content Management System (CMS) engineered for Full-Stack Developers. Built with **React 18**, **Vite 6**, **Tailwind CSS**, **Node.js Express REST API**, **Turso (libSQL)** edge database with **Drizzle ORM**, and authenticated **Cloudinary** media storage. Ready for seamless serverless deployment on **Vercel**.

![License: MIT](https://img.shields.io/badge/License-MIT-emerald)
![React: 18](https://img.shields.io/badge/React-18-emerald)
![Vite: 6](https://img.shields.io/badge/Vite-6-emerald)
![Database: Turso](https://img.shields.io/badge/Database-Turso%20%2F%20libSQL-00eb88)
![ORM: Drizzle](https://img.shields.io/badge/ORM-Drizzle-c5f74f)
![Media: Cloudinary](https://img.shields.io/badge/Media-Cloudinary-blue)
![Deploy: Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

---

## 1. Arsitektur & Gambaran Umum

Aplikasi ini dibagi menjadi dua bagian terpadu:

1. **Public Portfolio (`/`)**:
   Halaman portofolio interaktif bagi pengunjung publik dengan visual *Dark Tech Green*, performa tinggi, zero client-side layout shift, dan konten yang 100% dinamis bersumber dari database Turso melalui REST API.
2. **Admin CMS (`/admin`)**:
   Dashboard administratif privat yang dilindungi otentikasi session cookie server-side (`HttpOnly`, `SameSite=Lax`, `Secure` in production) untuk mengelola seluruh konten (Proyek, Artikel Blog, Skill, Riwayat Karir, Pendidikan, Kategori, Tag, Pesan Kontak, Pengaturan Situs, dan Aset Media Cloudinary) tanpa perlu menyunting kode sumber.

---

## 2. Tema Desain UI/UX & Design Tokens

Menerapkan tema visual **Dark Technology** bernuansa hijau tua yang minimalis, modern, dan berestetika engineering:

| Design Token | Hex Code | Deskripsi Penggunaan |
|---|---|---|
| Background Utama | `#07110D` | Canvas latar belakang utama |
| Surface (Latar Kartu) | `#0D1B14` | Card surface, sidebar, panel elevasi primer |
| Surface Sekunder | `#12251A` | Input field, badge tech, pill category, panel sekunder |
| Primary Green | `#16A34A` | Aksen tombol aksi, highlight utama, status indikator |
| Accent Neon | `#4ADE80` | Hover effects, teks aksen terang, gradient text highlight |
| Teks Utama | `#F3F7F4` | Heading utama dan teks tubuh dengan kontras tinggi |
| Teks Sekunder | `#A1B5A8` | Deskripsi, teks pendukung, dan label form |
| Border | `#243A2C` | Garis pembatas kartu, separator, dan outline input |

Tipografi menggunakan kombinasi **Inter** (antarmuka bersih dan nyaman dibaca) dan **JetBrains Mono** (status, badge teknologi, dan metadata teknis).

---

## 3. Fitur Utama

### A. Public Portfolio
- **Home (`/`)**: Hero section dengan status ketersediaan kerja, ringkasan profesional, direct CTA, teknologi utama, featured projects, nilai-nilai engineering, dan social links.
- **About (`/about`)**: Profil developer, biografi paragraf naratif, highlight spesialisasi, timeline karir, riwayat pendidikan, dan sertifikasi.
- **Projects (`/projects`)**: Filter kategori, pencarian real-time, pagination sisi server, detail arsitektur, tech stack badge, live demo & repository links. Item berstatus *draft* secara ketat disaring di level database.
- **Project Detail (`/projects/:slug`)**: Showcase mendalam, galeri gambar resolusi tinggi, daftar fitur utama, dan tautan deployment.
- **Skills (`/skills`)**: Pengelompokan domain (Frontend, Backend, Database, Tools, Deployment) dengan pemisahan transparan antara *Established* dan *Learning*.
- **Blog (`/blog` & `/blog/:slug`)**: Artikel teknis dengan perkiraan waktu baca, featured image, sanitasi HTML menggunakan **DOMPurify** untuk mencegah serangan XSS, tag filter, dan metadata SEO.
- **Contact (`/contact`)**: Form kontak tervalidasi Zod dengan rate limiting terintegrasi, honeypot bot trap tersembunyi, dan penyimpanan terenkripsi hash IP ke database.
- **Dynamic XML Sitemap (`/sitemap.xml`)**: Otomatis menghasilkan sitemap XML berdasarkan seluruh artikel dan proyek berstatus publikasi.

### B. Admin Content Management System (CMS)
- **Dashboard (`/admin`)**: Statistik live jumlah proyek, artikel blog, draft tersimpan, pesan kontak belum dibaca, dan log aktivitas audit.
- **Profile (`/admin/profile`)**: Manajemen bio, headline, kontak, social links, avatar, dan ketersediaan karir.
- **Projects CRUD (`/admin/projects`)**: Create, update, delete proyek, status toggle draft/published, multi-image gallery, tech stack builder.
- **Skills CRUD (`/admin/skills`)**: Pengelolaan skill per kategori, tingkat keahlian, urutan prioritas, dan status featured.
- **Experience & Education (`/admin/experience`, `/admin/education`)**: Manajemen linimasa karir, riwayat pendidikan formal, dan kredensial sertifikasi.
- **Blog CRUD (`/admin/blog`)**: Content editor dengan auto-slug generator, ringkasan excerpt, pemilihan kategori, tag association, dan featured image.
- **Taxonomies (`/admin/categories`, `/admin/tags`)**: Manajemen kategori dan tag terpusat untuk proyek dan artikel blog.
- **Cloudinary Media Manager (`/admin/media`)**: Upload aset gambar, preview, kalkulasi ukuran/dimensi, serta penghapusan aman dengan validasi dependensi (mencegah penghapusan gambar yang sedang dipakai oleh proyek atau blog).
- **Messages Inbox (`/admin/messages`)**: Tinjauan pesan masuk dari formulir kontak, status read/unread, dan penghapusan pesan spam.
- **Navigation & Settings (`/admin/navigation`, `/admin/settings`)**: Konfigurasi menu navigasi dan pengaturan metadata website.
- **Security & Audit Logs (`/admin/security`)**: Ubah password master dengan enkripsi bcrypt dan pemantauan riwayat log audit administratif.

---

## 4. Teknologi yang Digunakan

- **Frontend**: React 18, Vite 6, Tailwind CSS 3.4, React Router 7, TanStack React Query 5, React Hook Form, Zod, Lucide React, DOMPurify.
- **Backend**: Node.js, Express, Zod Request Validation, Express Rate Limit, Helmet Security Headers, Cookie Parser, CORS.
- **Database**: Turso (libSQL) edge-replicated SQLite, Drizzle ORM, Drizzle Kit.
- **Media Storage**: Cloudinary SDK (dengan fallback base64 lokal jika kredensial belum diatur).
- **Security**: Bcrypt password hashing (cost factor 12), SHA-256 session token hashing, HttpOnly secure cookies, CSRF protection, Honeypot bot protection.
- **Deployment**: Vercel Serverless Functions (`api/index.js`) + Single-Page Application rewrites (`vercel.json`).

---

## 5. Struktur Direktori Proyek

```text
portofolio/
├── api/
│   └── index.js             # Vercel serverless entry point
├── public/
│   ├── favicon.svg          # Favicon Dark Tech Green
│   └── robots.txt           # File instruksi bot crawler
├── server/
│   ├── db/
│   │   ├── index.js         # Turso/libSQL client & auto-migration DDL
│   │   ├── schema.js        # Skema Drizzle ORM (18 tabel)
│   │   └── seed.js          # Seeding data inisial lengkap
│   ├── middleware/
│   │   ├── audit.js         # Pencatatan audit log administratif
│   │   ├── auth.js          # Proteksi session & verifikasi token HttpOnly
│   │   ├── rateLimiter.js   # Pembatas request (auth & contact)
│   │   └── validation.js    # Middleware validasi skema Zod
│   ├── routes/
│   │   ├── admin.js         # Seluruh endpoint CRUD CMS privat
│   │   ├── auth.js          # Endpoint login, logout, me, bootstrap
│   │   └── public.js        # Endpoint publik teroptimasi untuk pengunjung
│   ├── services/
│   │   └── cloudinary.js    # Layanan upload & penghapusan Cloudinary
│   ├── app.js               # Konfigurasi Express & sitemap generator
│   └── index.js             # Local standalone server launcher (port 5000)
├── src/
│   ├── api/
│   │   └── client.js        # Axios/Fetch client wrapper terpusat
│   ├── components/
│   │   ├── layout/          # PublicLayout, AdminLayout, Navbars, Footers
│   │   └── ui/              # Modal, Badge, Button, Input, Skeleton
│   ├── context/
│   │   ├── AuthContext.jsx  # Context state autentikasi admin
│   │   └── ToastContext.jsx # Notifikasi feedback aksi pengguna
│   ├── pages/
│   │   ├── admin/           # 17 Halaman Admin CMS
│   │   └── public/          # 9 Halaman Website Publik
│   ├── App.jsx              # Routing React Router
│   ├── index.css            # Variabel CSS & directori Tailwind
│   └── main.jsx             # Entry point React DOM
├── tests/
│   ├── api.test.js          # Integration & CRUD test suite (Node test runner)
│   └── validation.test.js   # Unit & security test suite
├── .env.example             # Template variabel lingkungan terdokumentasi
├── tailwind.config.js       # Konfigurasi palet warna Dark Tech Green
├── vercel.json              # Konfigurasi rewrite & HTTP security headers Vercel
└── vite.config.js           # Konfigurasi Vite & dev server proxy
```

---

## 6. Prasyarat & Instalasi

### Prasyarat:
- **Node.js**: versi 18.0.0 atau lebih baru (direkomendasikan Node 20 LTS atau 22).
- **NPM**: versi 9.0.0 atau lebih baru.
- Akun **Turso** (opsional untuk lokal; default lokal otomatis memakai `file:local.db`).
- Akun **Cloudinary** (opsional untuk lokal; default lokal otomatis memakai fallback aman base64).

### Langkah Instalasi:

1. Clone repositori:
   ```bash
   git clone <url-repositori-anda>
   cd portofolio
   ```

2. Pasang dependensi proyek:
   ```bash
   npm install
   ```

3. Buat file lingkungan lokal:
   ```bash
   cp .env.example .env
   ```

---

## 7. Konfigurasi Lingkungan (.env)

Buka file `.env` dan sesuaikan nilainya:

```env
# Frontend (Dikosongkan saat local dev agar menggunakan proxy Vite)
VITE_API_BASE_URL=

# Database Turso / libSQL
# Kosongkan untuk memakai file SQLite lokal (file:local.db), atau isi URL Turso Anda:
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=

# Cloudinary Media Storage (Kosongkan saat lokal jika belum ada akun)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Kredensial Inisialisasi Admin Pertama
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminPortfolio#2026!
ADMIN_BOOTSTRAP_SECRET=your-random-bootstrap-secret-key-32chars

# Server & URL Produksi
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

## 8. Panduan Database Turso & Migrasi

### A. Menggunakan Database Lokal (Zero-Config)
Secara bawaan, jika `TURSO_DATABASE_URL` tidak diisi, backend otomatis menggunakan file lokal `file:local.db`.

### B. Menghubungkan ke Turso Cloud
1. Pasang CLI Turso atau daftar melalui dashboard [turso.tech](https://turso.tech).
2. Buat database baru:
   ```bash
   turso db create portfolio-db
   ```
3. Dapatkan database URL:
   ```bash
   turso db show portfolio-db --url
   ```
4. Dapatkan auth token:
   ```bash
   turso db tokens create portfolio-db
   ```
5. Tempelkan URL (`libsql://...`) dan token ke variabel `TURSO_DATABASE_URL` dan `TURSO_AUTH_TOKEN` pada file `.env`.

### C. Menjalankan Migrasi & Seeding Data Awal
Jalankan perintah berikut untuk memverifikasi tabel dan mengisi konten inisial:

```bash
# Menjalankan DDL migrasi otomatis
npm run db:migrate

# Mengisi data portofolio awal & akun admin pertama
npm run db:seed
```

---

## 9. Menjalankan Aplikasi di Lingkungan Development

Untuk menjalankan backend Express API dan frontend Vite secara bersamaan dalam satu perintah:

```bash
npm run dev
```

- Frontend akan berjalan di: **[http://localhost:5173](http://localhost:5173)**
- Backend API akan berjalan di: **[http://localhost:5000](http://localhost:5000)**
- Halaman Login Admin: **[http://localhost:5173/admin/login](http://localhost:5173/admin/login)**
  - Email: `admin@example.com`
  - Password: `AdminPortfolio#2026!`

Jika ingin menjalankan secara terpisah:
- Hanya backend: `npm run dev:server`
- Hanya frontend: `npm run dev:client`

---

## 10. Pengujian Otomatis (Testing)

Proyek ini dilengkapi dengan rangkaian pengujian komprehensif menggunakan native Node.js test runner:
- Integration Test API Endpoints
- Public/Draft Isolation Test
- Authenticated Admin CRUD (Create, Read, Update, Delete)
- Honeypot Spam Protection
- Unauthorized Upload Rejection
- Password Hashing & Token Verification
- Email Validation & Sanitization

Jalankan seluruh tes dengan:

```bash
npm test
```

Hasil verifikasi:
```text
✔ API Endpoints Suite
  ✔ GET /api/health returns status ok
  ✔ GET /sitemap.xml returns XML sitemap
  ✔ GET /api/profile returns developer details
  ✔ GET /api/projects returns published projects with pagination
  ✔ GET /api/projects/:slug returns single project detail
  ✔ GET /api/skills returns list and grouped categories
  ✔ POST /api/contact submits valid message and rejects spam honeypot
  ✔ Protected /api/admin/dashboard rejects unauthorized requests
  ✔ Protected /api/admin/media/upload rejects unauthorized uploads
  ✔ POST /api/auth/login succeeds with valid credentials and sets session
  ✔ Admin CRUD workflow on Categories
  ✔ Draft content isolation: draft items cannot be viewed on public endpoints
✔ Security & Validation Suite
  ✔ Password hashing and verification with bcrypt
  ✔ Session token generation and SHA-256 hashing
  ✔ Input sanitization and email validation
ℹ tests 15, suites 2, pass 15, fail 0
```

---

## 11. Build Produksi

Lakukan kompilasi bundle frontend:

```bash
npm run build
```

Bundle produksi yang telah dioptimalkan dan di-gzip akan tersimpan pada direktori `dist/`.

---

## 12. Deployment ke Vercel

Proyek ini telah dikonfigurasi penuh untuk runtime Vercel tanpa memerlukan server fisik terpisah:

1. **Push Proyek ke GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete full CMS portfolio with Turso & Cloudinary"
   git push origin main
   ```

2. **Impor ke Vercel Dashboard**:
   - Masuk ke [vercel.com](https://vercel.com/) dan pilih **Add New Project**.
   - Pilih repositori GitHub Anda.
   - Framework Preset: **Vite** (terdeteksi otomatis).
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Atur Environment Variables di Vercel**:
   Pada menu **Settings > Environment Variables**, tambahkan:
   - `TURSO_DATABASE_URL`: `libsql://your-turso-database-org.turso.io`
   - `TURSO_AUTH_TOKEN`: `your-turso-auth-token`
   - `CLOUDINARY_CLOUD_NAME`: `your-cloud-name`
   - `CLOUDINARY_API_KEY`: `your-api-key`
   - `CLOUDINARY_API_SECRET`: `your-api-secret`
   - `ADMIN_EMAIL`: email admin Anda
   - `ADMIN_PASSWORD`: password aman admin Anda
   - `ADMIN_BOOTSTRAP_SECRET`: random secret untuk bootstrap
   - `APP_URL`: domain produksi Vercel Anda (e.g. `https://your-portfolio.vercel.app`)
   - `CORS_ALLOWED_ORIGINS`: domain produksi Vercel Anda
   - `NODE_ENV`: `production`

4. **Deploy**:
   Klik tombol **Deploy**. Vercel akan mem-build frontend dan mengarahkan rute `/api/*` secara otomatis ke serverless function `api/index.js` sesuai spesifikasi `vercel.json`.

---

## 13. Ringkasan Endpoint API

### Public Endpoints:
- `GET /api/health` — Status kesehatan server
- `GET /sitemap.xml` — Sitemap XML dinamis
- `GET /api/profile` — Informasi profil pengembang
- `GET /api/projects` — Daftar proyek terpublikasi (filter & pagination)
- `GET /api/projects/:slug` — Detail lengkap satu proyek
- `GET /api/skills` — Daftar kompetensi teknis & pengelompokan
- `GET /api/experiences` — Linimasa riwayat karir
- `GET /api/educations` — Riwayat pendidikan & sertifikasi
- `GET /api/blog` — Daftar artikel blog terpublikasi
- `GET /api/blog/:slug` — Detail artikel blog & tag
- `GET /api/categories` — Daftar kategori publik
- `GET /api/tags` — Daftar tag publik
- `GET /api/navigation` — Menu navigasi situs
- `GET /api/settings` — Pengaturan publik situs
- `POST /api/contact` — Pengiriman formulir kontak (Rate limited, honeypot protected)

### Auth Endpoints:
- `POST /api/auth/login` — Autentikasi admin (Set cookie session)
- `POST /api/auth/logout` — Mengakhiri sesi di server & browser
- `GET /api/auth/me` — Memverifikasi sesi aktif admin
- `POST /api/auth/change-password` — Mengubah password admin
- `POST /api/auth/bootstrap` — Menginisialisasi akun admin pertama via master secret

### Protected Admin Endpoints (`/api/admin/*`):
- `GET /api/admin/dashboard` — Statistik ringkasan CMS & log aktivitas
- `GET / PUT /api/admin/profile` — Manajemen data profil
- `GET / POST / PUT / DELETE /api/admin/projects` — Manajemen CRUD proyek
- `GET / POST / PUT / DELETE /api/admin/skills` — Manajemen CRUD skill
- `GET / POST / PUT / DELETE /api/admin/experience` — Manajemen CRUD karir
- `GET / POST / PUT / DELETE /api/admin/education` — Manajemen CRUD pendidikan
- `GET / POST / PUT / DELETE /api/admin/certifications` — Manajemen CRUD sertifikasi
- `GET / POST / PUT / DELETE /api/admin/blog` — Manajemen CRUD blog
- `GET / POST / PUT / DELETE /api/admin/categories` — Manajemen CRUD kategori
- `GET / POST / PUT / DELETE /api/admin/tags` — Manajemen CRUD tag
- `GET / POST / DELETE /api/admin/media` — Upload & hapus aset Cloudinary
- `GET / PUT / DELETE /api/admin/messages` — Inbox pesan masuk
- `GET / POST / PUT / DELETE /api/admin/navigation` — Manajemen menu navigasi
- `GET / PUT /api/admin/settings` — Konfigurasi pengaturan situs
- `GET /api/admin/security/audit-logs` — Riwayat log audit aktivitas admin

---

## 14. Lisensi

Proyek ini dirilis di bawah lisensi terbuka [MIT License](LICENSE).
