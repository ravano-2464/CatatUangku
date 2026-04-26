import { expenseCategories } from '../constants/categories';
import { ScanDraft } from '../types/finance';

const randomFrom = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const notes = [
  'Belanja kebutuhan mingguan',
  'Makan siang kantor',
  'Transportasi harian',
  'Bayar tagihan bulanan',
  'Belanja minimarket',
];

export const generateScanDraft = (): ScanDraft => {
  const baseAmount = 15000 + Math.floor(Math.random() * 450000);

  return {
    amount: baseAmount,
    category: randomFrom(expenseCategories),
    note: randomFrom(notes),
    date: new Date().toISOString(),
    type: 'expense',
  };
};
