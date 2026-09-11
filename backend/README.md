# Nalar — Backend REST API (Laravel 12)

Backend REST API untuk **Nalar — AI Learning Companion**, dibangun menggunakan **Laravel 12**, **PHP 8.3+**, dan **MySQL**.

Backend ini bertindak sebagai API gateway dan core business logic untuk pemrosesan dokumen PDF materi perkuliahan, ekstraksi topik, evaluasi diagnostik kuis, pelacakan profil penguasaan (Knowledge Profile), serta mesin rekomendasi belajar terarah.

---

## 1. Arsitektur Sistem

```
Next.js Frontend (Port 3000)
        ↓ HTTP REST API
Laravel Backend (Port 8000)
        ↓
MySQL Database (Port 3306)
        ↓ (Grounded Context)
AIService Abstraction
    ├── MockAIService (Development / Offline)
    └── OpenClawService (Hackfest VPS Agent)
```

---

## 2. Requirements

- **PHP**: >= 8.2 (Tested on PHP 8.5.10 with extensions: `pdo_mysql`, `mbstring`, `fileinfo`, `openssl`, `curl`, `dom`, `intl`)
- **Composer**: >= 2.0
- **MySQL / MariaDB**: >= 8.0 (Tested on MySQL 8.4)
- **Node.js & npm**: (Untuk frontend Next.js)

---

## 3. Instalasi & Setup Backend

### Langkah 1: Pindah ke Direktori Backend
```bash
cd backend
```

### Langkah 2: Salin File Environment & Generate Key
```bash
cp .env.example .env
php artisan key:generate
```

### Langkah 3: Konfigurasi Database di `.env`
Pastikan kredensial MySQL pada `backend/.env` sesuai dengan environment lokal Anda:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nalar
DB_USERNAME=root
DB_PASSWORD=

AI_PROVIDER=mock

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Pastikan database `nalar` sudah dibuat di MySQL:
```sql
CREATE DATABASE IF NOT EXISTS nalar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Langkah 4: Jalankan Migration & Seeder
```bash
php artisan migrate:fresh --seed
```

Seeder akan membuat data awal untuk `demo-student`:
- Materi: *Pemrograman Berorientasi Objek Dasar*
- 4 Topik: *Encapsulation (90%)*, *Inheritance (85%)*, *Polymorphism (40%)*, *Abstraction (55%)*
- Kuis Diagnostik & 1 Riwayat Kuis (Skor 60%)
- Rekomendasi Aktif: *Polymorphism* (karena tingkat penguasaan terendah)

### Langkah 5: Jalankan Server Laravel
```bash
php artisan serve
```
Server akan berjalan di: `http://127.0.0.1:8000`

---

## 4. REST API Endpoints

Semua response menggunakan format JSON standar:
```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/health` | Healthcheck server API |
| `GET` | `/api/dashboard` | Statistik dashboard, kuis terbaru, ringkasan topik & rekomendasi |
| `POST` | `/api/materials` | Upload materi kuliah (PDF multipart/form-data) |
| `GET` | `/api/materials` | Daftar riwayat materi milik mahasiswa |
| `GET` | `/api/materials/{id}` | Detail materi berserta chunk & topik |
| `DELETE` | `/api/materials/{id}` | Hapus materi dan file terkait |
| `POST` | `/api/materials/{id}/process` | Proses PDF (ekstraksi teks, chunking, dan ekstraksi topik) |
| `GET` | `/api/materials/{id}/status` | Cek status proses materi (`pending`, `processing`, `completed`, `failed`) |
| `GET` | `/api/materials/{id}/topics` | Daftar topik yang diekstraksi dari materi |
| `POST` | `/api/tutor/ask` | Tanya AI Tutor berbasis grounded context materi |
| `POST` | `/api/quizzes/generate` | Generate kuis diagnostik adaptif |
| `GET` | `/api/quizzes/{id}` | Ambil pertanyaan kuis (kunci jawaban disembunyikan) |
| `POST` | `/api/quizzes/{id}/submit` | Submit kuis, hitung nilai di server, update mastery & rekomendasi |
| `GET` | `/api/quizzes/{id}/attempts` | Riwayat percobaan kuis |
| `GET` | `/api/progress` | Knowledge Profile (persentase mastery tiap topik) |
| `GET` | `/api/progress/{topic}` | Detail mastery untuk topik spesifik |
| `GET` | `/api/recommendations` | Rekomendasi belajar terarah prioritas tinggi |

---

## 5. Abstraksi AI & Integrasi OpenClaw

Backend menggunakan antarmuka `AIServiceInterface` dengan dua implementasi:

1. **`MockAIService`** (Default):
   - Menghasilkan respon deterministik berkualitas tinggi tanpa dependensi jaringan eksternal.
   - Menyediakan bank soal kuis 4 opsi dengan kunci dan penjelasan.
   - Menghitung kelemahan dan saran adaptif secara instan.

2. **`OpenClawService`**:
   - Adapter untuk integrasi agen OpenClaw di VPS Hackfest.
   - Konfigurasi via `.env`:
     ```env
     AI_PROVIDER=openclaw
     OPENCLAW_BASE_URL=https://hackfest-openclaw.example.com
     OPENCLAW_API_KEY=your_openclaw_api_key
     OPENCLAW_AGENT_ID=your_agent_id
     ```
   - Dilengkapi graceful fallback ke `MockAIService` jika koneksi OpenClaw offline/gagal.

---

## 6. Formula Knowledge Profile

Penguasaan topik (*mastery*) diperbarui di sisi server setelah setiap submission kuis:
$$\text{new\_mastery} = (\text{previous\_mastery} \times 0.6) + (\text{current\_performance} \times 0.4)$$
- Jika topik baru pertama kali dikerjakan: $\text{new\_mastery} = \text{current\_performance}$
- Nilai selalu dibatasi pada rentang $0 - 100\%$.

---

## 7. Testing Otomatis

Jalankan rangkaian test otomatis Laravel:
```bash
php artisan test
```

Semua 10 unit dan feature test mencakup:
- Upload materi PDF & validasi tipe berkas
- Pemrosesan PDF & ekstraksi chunk & topik
- Tanya AI Tutor & sitasi referensi materi
- Pembuatan kuis diagnostik
- Penilaian kuis di sisi server & keamanan kunci jawaban
- Pembaruan mastery topik pada Knowledge Profile
- Pembuatan rekomendasi belajar otomatis
- Respon dashboard teragregasi
