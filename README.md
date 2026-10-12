# MM Tailor Workforce — Web Frontend

Aplikasi operasional dan manajemen alur kerja (workflow) penjahitan untuk **MM Tailor**, dibangun dengan antarmuka modern business SaaS, desain konsisten sesuai [design.md](../design.md), dan terintegrasi penuh dengan MM Tailor HRIS Backend API.

---

## 🛠 Tech Stack

- **Framework & Tooling:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) dengan Design Tokens resmi
- **Icons:** [Lucide React](https://lucide.dev/)
- **Typography:** Google Font [Inter](https://fonts.google.com/specimen/Inter)

---

## 🚀 Fitur yang Tersedia

### 1. Autentikasi & Session
- Form login aman dengan proteksi multi-role (`Admin`, `Staff`, `Tailor`).
- Password visibility toggle (sembunyikan / tampilkan kata sandi).
- Token JWT disimpan di `localStorage` dan dikirim otomatis via Bearer token HTTP interceptor.
- Centralized 401 Unauthorized handling yang otomatis mengarahkan ke halaman login jika token kedaluwarsa.
- Profil pengguna aktif (`/profile`) dan tombol Logout.

### 2. Dashboard Operasional (`/dashboard`)
- KPI Cards keuangan nyata: Total Pendapatan (*Revenue*), Pembayaran Diterima (*Cash In*), Sisa Piutang (*Outstanding*), dan Total Order.
- Filter periode laporan (Tanggal Mulai & Tanggal Selesai).
- Ringkasan distribusi status produksi pakaian (Pending, Measurement, Cutting, Sewing, Finishing, Ready Pickup, Completed, Cancelled).
- Tabel order terbaru (*Recent Orders*) dengan status badge dan aksi cepat.

### 3. Modul Pelanggan (`/customers`)
- Pencarian pelanggan berdasarkan nama, nomor telepon / WhatsApp, atau email.
- Pagination tabel sesuai kontrak API backend (`page`, `limit`, `total`, `total_pages`).
- Tambah pelanggan baru (`POST /api/customers`) dengan kode pelanggan, nama, kontak, dan alamat.
- Edit data pelanggan (`PUT /api/customers/:id`).
- Hapus pelanggan dengan dialog konfirmasi aman (*ConfirmDialog*).

### 4. Modul Order & Alur Produksi (`/orders`)
- Filter tab status produksi jahitan lengkap.
- Pencarian nomor invoice, nama pelanggan, atau penjahit penanggung jawab.
- **Buat Order Baru (`/orders/new`):**
  - Pemilihan pelanggan & karyawan penanggung jawab.
  - Tanggal order dan estimasi tanggal pengambilan (*pickup date*).
  - Penambahan multi-item layanan jahit kustom dengan kuantitas (qty) dan kalkulasi otomatis.
  - Catatan khusus pengerjaan.

### 5. Detail Order (`/orders/:id`)
- Header informasi order & badge status terkini.
- **Workflow State Transitions:** Tombol transisi alur kerja hanya menampilkan status selanjutnya yang diizinkan oleh business rules backend:
  - `Pending` ➔ `Measurement` / `Cancelled`
  - `Measurement` ➔ `Cutting` / `Cancelled`
  - `Cutting` ➔ `Sewing` / `Cancelled`
  - `Sewing` ➔ `Finishing` / `Cancelled`
  - `Finishing` ➔ `Ready Pickup`
  - `Ready Pickup` ➔ `Completed`
- **Tabel Item Layanan Jahit:** Menampilkan kuantitas, harga satuan, dan subtotal, serta tombol tambah/edit/hapus item.
- **Ukuran Badan Pelanggan (Fitting):** Menampilkan dan mencatat 8 titik pengukuran tubuh (Lingkar dada, pinggang, pinggul, lebar bahu, panjang lengan, panjang baju, leher, kerung lengan).
- **Status Pembayaran & Riwayat Kas:** Menampilkan total tagihan, total terbayar, sisa piutang, status pelunasan, serta tombol *Catat Pembayaran*.
- **Timeline Riwayat Status:** Jejak audit kronologis perubahan status pesanan dengan waktu tercatat.

### 6. Modul Pembayaran (`/payments`)
- Daftar seluruh transaksi pembayaran yang tercatat di sistem.
- Filter berdasarkan metode pembayaran (`Cash`, `Transfer`, `QRIS`) dan status pelunasan (`Paid`, `Pending`).
- Modal cepat untuk mencatat pembayaran baru pada order aktif dengan validasi sisa saldo.

---

## 📋 Prasyarat

- **Node.js**: Versi 18+ (direkomendasikan Node.js 20 atau 22+)
- **NPM**: Versi 9+
- **Backend API**: Server MM Tailor HRIS API berjalan di `http://localhost:3000` (atau port yang ditentukan).

---

## ⚙️ Variabel Lingkungan (.env)

Buat file `.env` di dalam folder `workforce-hris-web/`:

```env
# Gunakan '/api' untuk memanfaatkan Vite reverse proxy (menghindari isu CORS di browser)
VITE_API_BASE_URL=/api
```

> **Catatan Integrasi:** Jika frontend di-deploy terpisah tanpa reverse proxy, Anda dapat mengarahkan `VITE_API_BASE_URL` langsung ke URL API backend (misalnya `http://localhost:3000/api`).

---

## 💻 Cara Menjalankan

### 1. Masuk ke direktori frontend
```bash
cd workforce-hris-web
```

### 2. Pasang dependensi
```bash
npm install
```

### 3. Jalankan development server
```bash
npm run dev
```

Aplikasi frontend akan berjalan pada:
`http://localhost:5173/`

### 4. Build untuk Production
```bash
npm run build
```

Hasil kompilasi produksi yang optimal akan tersedia di folder `dist/`.

---

## 🔐 Kredensial Default untuk Pengujian

Gunakan kredensial admin berikut untuk masuk:
- **Username:** `admin`
- **Password:** `admin123`

---

## 📂 Struktur Direktori

```text
workforce-hris-web/
├── src/
│   ├── api/                   # Dedicated API client & services layer
│   │   ├── client.js          # Axios instance & token interceptors
│   │   ├── auth.js            # Login & user profile endpoints
│   │   ├── dashboard.js       # Dashboard summary endpoint
│   │   ├── customers.js       # Customer CRUD endpoints
│   │   ├── orders.js          # Order & workflow endpoints
│   │   ├── orderDetails.js    # Order line items endpoints
│   │   ├── payments.js        # Payments & recording endpoints
│   │   ├── services.js        # Tailoring catalog services
│   │   ├── employees.js       # Employee PIC list
│   │   └── measurements.js    # Body fitting measurements
│   ├── components/
│   │   ├── layout/            # AppLayout, Sidebar, Topbar, PageHeader
│   │   └── ui/                # Button, Input, Select, Badge, Card, Modal,
│   │                          # Table, Pagination, Skeleton, EmptyState,
│   │                          # ErrorState, ConfirmDialog
│   ├── context/               # AuthContext (session) & ToastContext (notifikasi)
│   ├── pages/
│   │   ├── customers/         # CustomerList & CustomerModal
│   │   ├── orders/            # OrderList, CreateOrder, OrderDetail, MeasurementModal
│   │   ├── payments/          # PaymentList & CreatePaymentModal
│   │   ├── profile/           # Profile page
│   │   ├── Login.jsx          # Login page
│   │   └── NotFound.jsx       # 404 page
│   ├── routes/                # ProtectedRoute & AppRoutes
│   ├── utils/                 # formatters.js & statusConfig.js
│   ├── index.css              # Design tokens & Tailwind CSS setup
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```
