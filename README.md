# dumbways-batch65-stage1

Tugas hari ke-8: aplikasi Express + Handlebars (HBS) dengan layout dan partials.

## Ringkas
- Templating HBS dengan layout `main.hbs`
- Partial navbar (`navbar.hbs`)
- Static assets dari folder `public`

## Tech Stack
- Node.js + Express
- Handlebars (`hbs` + `express-handlebars`)
- Nodemon (dev)

## Struktur Folder
- `app.js` - entry server Express
- `public/` - CSS/JS/asset statis
- `src/` - source utama
- `src/controllers/` - controller handler
- `src/db/` - konfigurasi/akses database
- `src/middlewares/` - middleware Express
- `src/repositories/` - data access layer
- `src/routes/` - definisi routes
- `src/services/` - business logic
- `src/validators/` - validasi request
- `src/views/` - file HBS
- `src/views/layouts/` - layout (`main.hbs`)
- `src/views/partials/` - partials (`navbar.hbs`)

## Cara Menjalankan
1. Install dependencies
   ```bash
   npm install
   ```
2. Jalankan server
   ```bash
   npm run dev
   ```
3. Buka browser
   - `http://localhost:3000/`

## Routes
- `/` -> `home.hbs`
- `/projects` -> `projects.hbs`
- `/project-detail` -> `project-detail.hbs`
- `/contact` -> `contact.hbs`

## Catatan
Jika CSS/Bootstrap tidak tampil, pastikan:
- Server berjalan dengan `npm run dev`
- Akses halaman lewat `http://localhost:3000/...` (bukan file HTML/HBS langsung)

## Lisensi
ISC

---
Author: Syam
