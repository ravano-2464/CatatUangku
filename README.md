# CatatUangku Mobile Prototype

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-1f2937?style=for-the-badge&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-0ea5e9?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-2563eb?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/Styling-NativeWind-14b8a6?style=for-the-badge)](https://www.nativewind.dev/)
[![Zustand](https://img.shields.io/badge/State-Zustand-f97316?style=for-the-badge)](https://zustand-demo.pmnd.rs/)

Prototype aplikasi mobile frontend untuk pencatatan keuangan pribadi dengan fokus pada:
- kecepatan input transaksi
- simulasi scan struk
- clarity data untuk testing user langsung

## Ringkasan MVP

Fitur utama yang sudah tersedia:
- Dashboard: total saldo, pemasukan, pengeluaran, sisa budget
- Tambah transaksi:
1. Input manual
2. Scan struk (simulasi OCR)
- Review hasil scan: nominal, kategori, catatan bisa diedit sebelum simpan
- Laporan keuangan: filter harian/mingguan/bulanan + visualisasi sederhana
- Atur budget: limit pengeluaran, budget terpakai, sisa budget
- Simulation support:
1. Dummy data generator
2. Save feedback (toast/alert)
3. Logging frekuensi fitur dan total transaksi ditambahkan

## User Flow Testing

Flow utama untuk validasi user:
1. Buka tab `Tambah`
2. Pilih `Input Manual` atau `Scan Struk`
3. Simpan transaksi
4. Kembali ke `Dashboard` untuk melihat update data
5. Cek `Laporan` dan `Budget` untuk evaluasi insight

## Tech Stack

- Framework: React Native (Expo)
- Language: TypeScript (strict mode)
- Styling: Tailwind via NativeWind
- State Management: Zustand
- Navigation: React Navigation (Stack + Bottom Tabs)
- Utility: Image Picker, Date Picker, Haptics

## Struktur Project

```txt
.
├── App.tsx
├── app.json
├── babel.config.js
├── tailwind.config.js
├── src
│   ├── components
│   ├── constants
│   ├── navigation
│   ├── screens
│   ├── store
│   ├── types
│   └── utils
└── assets
```

## Menjalankan Aplikasi

Prerequisite:
- Node.js LTS
- npm
- Expo Go (Android/iOS) atau emulator

Install dependency:

```bash
npm install
```

Run development server:

```bash
npm run start
```

Shortcut platform:

```bash
npm run android
npm run ios
npm run web
```

## Scripts

- `npm run start` menjalankan Expo dev server
- `npm run android` membuka ke Android
- `npm run ios` membuka ke iOS
- `npm run web` membuka ke web

## Catatan Implementasi

- Tidak menggunakan backend real (sesuai scope prototype testing).
- Scan struk menggunakan generator dummy OCR di local state.
- Data transaksi, budget, dan analytics disimpan di store Zustand (in-memory).

## Status

Prototype siap dipakai untuk:
- usability testing awal
- validasi fitur scan struk
- validasi alur pencatatan transaksi cepat
