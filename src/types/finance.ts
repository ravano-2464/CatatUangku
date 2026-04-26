export type TransactionType = 'income' | 'expense';

export type TransactionSource = 'manual' | 'scan' | 'dummy';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
  type: TransactionType;
  source: TransactionSource;
}

export interface ScanDraft {
  amount: number;
  category: string;
  note: string;
  date: string;
  type: TransactionType;
}

export type ReportFilter = 'daily' | 'weekly' | 'monthly';

export const FEATURE_KEYS = [
  'dashboard_view',
  'add_transaction_view',
  'manual_input',
  'scan_receipt',
  'save_manual',
  'save_scan',
  'report_view',
  'budget_view',
  'set_budget',
  'generate_dummy',
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

export type FeatureUsageMap = Record<FeatureKey, number>;

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  dashboard_view: 'Dashboard',
  add_transaction_view: 'Tambah Transaksi',
  manual_input: 'Input Manual',
  scan_receipt: 'Scan Struk',
  save_manual: 'Simpan Manual',
  save_scan: 'Simpan Hasil Scan',
  report_view: 'Laporan',
  budget_view: 'Atur Budget',
  set_budget: 'Set Budget',
  generate_dummy: 'Dummy Data',
};
