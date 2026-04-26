# 💸 CatatUangku Mobile Prototype

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-1f2937?style=for-the-badge&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-0ea5e9?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-2563eb?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/Styling-NativeWind-14b8a6?style=for-the-badge)](https://www.nativewind.dev/)
[![Zustand](https://img.shields.io/badge/State-Zustand-f97316?style=for-the-badge)](https://zustand-demo.pmnd.rs/)

A mobile frontend prototype for personal finance tracking, focused on:
- fast transaction input
- receipt scan simulation
- clear financial data for direct user testing

## 🎯 MVP Overview

Main features currently implemented:
- Dashboard: total balance, total income, total expenses, remaining budget
- Add Transaction:
1. Manual input
2. Receipt scan (OCR simulation)
- Scan Review: editable amount, category, and notes before saving
- Financial Reports: daily/weekly/monthly filters + simple visualizations
- Budget Setup: spending limit, used budget, and remaining budget
- Testing Simulation Support:
1. Dummy data generator
2. Save feedback (toast/alert)
3. Feature usage logging and total transaction-add count

## 🧪 User Testing Flow

Primary validation flow:
1. Open the `Add` tab
2. Choose `Manual Input` or `Scan Receipt`
3. Save the transaction
4. Return to `Dashboard` to confirm updates
5. Check `Reports` and `Budget` for behavior and clarity

## 🧰 Tech Stack

- Framework: React Native (Expo)
- Language: TypeScript (strict mode)
- Styling: Tailwind via NativeWind
- State Management: Zustand
- Navigation: React Navigation (Stack + Bottom Tabs)
- Utilities: Image Picker, Date Picker, Haptics

## 🗂️ Project Structure

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

## 🚀 Getting Started

### 🔧 Prerequisites
- Node.js (LTS recommended)
- npm
- Expo Go (Android/iOS) or emulator

### 📦 Install Dependencies

```bash
npm install
```

### ▶️ Run Development Server

```bash
npm run start
```

### 📱 Platform Shortcuts

```bash
npm run android
npm run ios
npm run web
```

## 📜 Scripts

- `npm run start`: starts Expo dev server
- `npm run android`: runs the app on Android
- `npm run ios`: runs the app on iOS
- `npm run web`: runs the app on web

## 🧠 Implementation Notes

- No real backend is used (aligned with prototype testing scope).
- Receipt scan uses local dummy OCR generation.
- Transactions, budget, and analytics are stored in Zustand (in-memory).

## ✅ Status

This prototype is ready for:
- early usability testing
- validating the receipt-scan experience
- validating fast transaction logging flow
