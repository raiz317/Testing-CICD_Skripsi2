# InstockFlow API - Backend Service

Layanan backend RESTful API untuk aplikasi manajemen inventaris dan supplier **InstockFlow**. Dibangun menggunakan Node.js dan Express.js, serta dilengkapi dengan sistem autentikasi berbasis session menggunakan Passport.js dan database MySQL.

---

## 🚀 Fitur Utama
* **Autentikasi Session & Passport.js:** Manajemen sesi pengguna yang aman menggunakan cookie terenkripsi bawaan server.
* **RESTful API CRUD:** Endpoint lengkap untuk manajemen data Produk dan Supplier.
* **Otorisasi Terproteksi:** Middleware `isAuthenticated` menjamin seluruh data inventaris tidak dapat diakses tanpa sesi login yang valid.
* **Validasi Duplikasi Akun:** Proteksi otomatis saat registrasi jika username atau email sudah terdaftar di database.
* **Error Handling & 404:** Response JSON standar global jika rute API atau server mengalami gangguan (Internal Server Error 500 / Not Found 404).

---

## 🛠️ Teknologi yang Digunakan
* **Runtime:** [Node.js](Versi v18 atau lebih tinggi)
* **Framework:** [Express.js](https://expressjs.com) (v5)
* **Database Driver:** [mysql2/promise] (Mendukung Async/Await)
* **Autentikasi:** [Passport.js](https://passportjs.org) & `passport-local`
* **Manajemen Sesi:** `express-session`
* **Keamanan Kata Sandi:** [bcrypt]
* **Variabel Lingkungan:** `dotenv`
* **Kebijakan Lintas Domain:** `cors`

---

## ⚙️ Persiapan dan Instalasi

### 1. Prasyarat
Pastikan Anda sudah mengaktifkan modul **Apache** dan **MySQL** di **XAMPP Control Panel** (atau database client sejenis).

### 2. Kloning / Masuk ke Folder Proyek
```bash
cd BE-sistem-inventory
```

### 3. Instalasi Dependency
Instal seluruh package pihak ketiga yang terdaftar di `package.json`:
```bash
npm install
```

### 4. Konfigurasi Environment (`.env`)
Buat berkas baru bernama `.env` di akar folder backend Anda (*root directory*), lalu isi dengan kredensial database Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_DATABASE=nama_database_anda
DB_PASSWORD=
SECRET_SESSION=kunci_rahasia
```
> ⚠️ **Catatan:** Ganti `nama_database_anda` sesuai dengan nama database yang Anda buat di phpMyAdmin.

### 5. Impor Struktur Database SQL
Masuk ke `http://localhost/phpmyadmin`, buat database baru dengan nama yang sesuai dengan berkas `.env` Anda. Buka tab **SQL**, salin query di bawah ini, lalu klik **Go/Kirim**:

```sql
-- Membuat Tabel Users (Untuk Fitur Login & Register)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Membuat Tabel Suppliers (Untuk Fitur Manajemen Supplier)
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier VARCHAR(100) NOT NULL,
    industry VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Membuat Tabel Products (Untuk Fitur Manajemen Produk & Perhitungan Dashboard)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    price INT NOT NULL DEFAULT 0,
    supplier VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DATA DUMMY AWAL (OPSIONAL)
INSERT INTO suppliers (id, supplier, industry, email, phone) VALUES
(1, 'PT Sinar Abadi', 'Manufaktur', 'sinar@abadi.co.id', '08123456789'),
(2, 'CV Gading Mas', 'Elektronik', 'gading@mas.com', '082345678910'),
(3, 'Toko Makmur', 'Logistik', 'toko@makmur.co.id', '08345678910');

INSERT INTO products (id, name, category, stock, price, supplier) VALUES
(1, 'Kertas A4 Sinar Dunia', 'ATK', 2, 35000, 'PT Sinar Abadi'),
(2, 'Tinta Printer Epson Black', 'Elektronik', 1, 3600000, 'CV Gading Mas'),
(3, 'Stopmap Kebangsaan', 'ATK', 3, 5000, 'PT Sinar Abadi'),
(4, 'Isolasi Daimaru 2 Inch', 'Logistik', 7, 15000, 'Toko Makmur');
```

---

## 🏃 Menyala-kan Server

Untuk menjalankan server backend Express pada port `3000`, eksekusi perintah berikut di terminal:

```bash
node index.js
```
Jika berhasil, terminal akan memunculkan log:
`Server running on port 3000`

---

## 📑 Dokumentasi Endpoint API

Semua rute API di bawah memiliki awalan URL dasar: `http://localhost:3000`

### 🔑 Endpoint Autentikasi (Terbuka Umum)

| Metode | Endpoint | Deskripsi | Bodi Permintaan (JSON) |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/register` | Mendaftarkan akun baru | `{ "username", "email", "password" }` |
| **POST** | `/api/login` | Masuk & menerbitkan Cookie Session | `{ "email", "password" }` *(Mendukung username)* |
| **POST** | `/api/logout` | Menghancurkan session di server | *Tidak ada* |
| **GET** | `/api/users/me` | Memeriksa status session aktif | *Tidak ada (Membaca Cookie)* |

### 📦 Endpoint Produk (Membutuhkan Login / Terproteksi)

| Metode | Endpoint | Deskripsi | Bodi Permintaan (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/products` | Mengambil seluruh data produk | *Tidak ada* |
| **POST** | `/api/products` | Menambahkan produk baru | `{ "name", "category", "stock", "price", "supplier" }` |
| **PUT** | `/api/products/:id` | Memperbarui data produk berdasarkan ID | `{ "name", "category", "stock", "price", "supplier" }` |
| **DELETE** | `/api/products/:id` | Menghapus produk dari database | *Tidak ada* |

### 🏢 Endpoint Supplier (Membutuhkan Login / Terproteksi)

| Metode | Endpoint | Deskripsi | Bodi Permintaan (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/suppliers` | Mengambil seluruh data supplier | *Tidak ada* |
| **POST** | `/api/suppliers` | Menambahkan supplier baru | `{ "supplier", "industry", "email", "phone" }` |
| **PUT** | `/api/suppliers/:id` | Memperbarui data supplier berdasarkan ID | `{ "supplier", "industry", "email", "phone" }` |
| **DELETE** | `/api/suppliers/:id` | Menghapus supplier dari database | *Tidak ada* |

---

## 🔒 Konfigurasi Keamanan CORS

Backend ini dikonfigurasi secara ketat untuk menerima permintaan eksklusif dari frontend React (Vite) pada alamat `http://localhost:5173` dengan izin pertukaran data kredensial cookie aman (`credentials: true`).
