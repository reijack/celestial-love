# Celestial Love ✦ (React version)

Versi React dari website "Our Celestial Love Story" — dibangun dengan Vite + React,
animasi digabung jadi lebih ringan/performant, fitur Star Wishes tetap tersambung ke Firebase.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Struktur

- `src/content.js` — semua teks (timeline, surat, reasons). Edit di sini kalau mau ubah isi.
- `src/supabase.js` — konfigurasi Supabase (Star Wishes).
- `src/components/` — semua komponen UI.
- `src/styles/global.css` — semua styling.

## Deploy ke Vercel (via GitHub)

1. Push folder ini ke repo GitHub baru.
2. Di [vercel.com](https://vercel.com) → **Add New Project** → import repo tadi.
3. Vercel otomatis mendeteksi ini project **Vite** — biarkan default settings
   (Build Command: `npm run build`, Output Directory: `dist`).
4. Klik **Deploy**.

## Catatan Supabase

Tabel `star_wishes` sudah dibuat lewat SQL Editor di Supabase dashboard, dengan
Row Level Security aktif dan policy public read/insert/update. Kalau mau lebih ketat
(misal cegah spam), policy bisa disesuaikan lagi lewat menu **Authentication > Policies**.

SQL setup tabel:

```sql
create table star_wishes (
  id bigint generated always as identity primary key,
  star_index integer not null unique,
  text text not null,
  created_at timestamptz default now()
);

alter table star_wishes enable row level security;

create policy "Allow public read" on star_wishes for select using (true);
create policy "Allow public insert" on star_wishes for insert with check (true);
create policy "Allow public update" on star_wishes for update using (true);
```

Untuk fitur realtime (update otomatis tanpa refresh), pastikan **Realtime** diaktifkan
untuk tabel `star_wishes` di menu **Database > Replication** pada Supabase dashboard.
