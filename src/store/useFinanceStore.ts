import { create } from 'zustand';
import { expenseCategories, incomeCategories } from '../constants/categories';
import {
  FeatureKey,
  Transaction,
  TransactionSource,
  TransactionType,
} from '../types/finance';
import { createDefaultFeatureUsage } from '../utils/finance';

interface FinanceState {
  transactions: Transaction[];
  budgetLimit: number;
  analytics: {
    transactionsAdded: number;
    featureUsage: ReturnType<typeof createDefaultFeatureUsage>;
  };
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  setBudgetLimit: (limit: number) => void;
  trackFeature: (feature: FeatureKey) => void;
  generateDummyData: (count?: number) => void;
}

const sourceToFeature: Partial<Record<TransactionSource, FeatureKey>> = {
  manual: 'save_manual',
  scan: 'save_scan',
};

const randomFrom = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const createTransactionId = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const createRandomDate = () => {
  const now = new Date();
  const dayOffset = Math.floor(Math.random() * 30);
  const randomDate = new Date(now);
  randomDate.setDate(now.getDate() - dayOffset);
  randomDate.setHours(Math.floor(Math.random() * 20) + 4);
  return randomDate.toISOString();
};

const createDummyTransaction = (): Omit<Transaction, 'id'> => {
  const type: TransactionType = Math.random() > 0.75 ? 'income' : 'expense';
  const category = type === 'expense' ? randomFrom(expenseCategories) : randomFrom(incomeCategories);
  const amount = type === 'expense' ? 15000 + Math.floor(Math.random() * 400000) : 200000 + Math.floor(Math.random() * 2500000);

  return {
    amount,
    category,
    note: type === 'expense' ? 'Dummy pengeluaran untuk testing' : 'Dummy pemasukan untuk testing',
    date: createRandomDate(),
    type,
    source: 'dummy',
  };
};

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: [],
  budgetLimit: 2_500_000,
  analytics: {
    transactionsAdded: 0,
    featureUsage: createDefaultFeatureUsage(),
  },

  addTransaction: (transaction) =>
    set((state) => {
      const nextFeatureUsage = { ...state.analytics.featureUsage };
      const sourceFeature = sourceToFeature[transaction.source];

      if (sourceFeature) {
        nextFeatureUsage[sourceFeature] = (nextFeatureUsage[sourceFeature] ?? 0) + 1;
      }

      return {
        transactions: [
          {
            ...transaction,
            id: createTransactionId(),
          },
          ...state.transactions,
        ],
        analytics: {
          transactionsAdded: state.analytics.transactionsAdded + 1,
          featureUsage: nextFeatureUsage,
        },
      };
    }),

  setBudgetLimit: (limit) =>
    set((state) => ({
      budgetLimit: limit,
      analytics: {
        ...state.analytics,
        featureUsage: {
          ...state.analytics.featureUsage,
          set_budget: state.analytics.featureUsage.set_budget + 1,
        },
      },
    })),

  trackFeature: (feature) =>
    set((state) => ({
      analytics: {
        ...state.analytics,
        featureUsage: {
          ...state.analytics.featureUsage,
          [feature]: state.analytics.featureUsage[feature] + 1,
        },
      },
    })),

  generateDummyData: (count = 8) =>
    set((state) => {
      const generated = Array.from({ length: count }, () => ({
        ...createDummyTransaction(),
        id: createTransactionId(),
      }));

      return {
        transactions: [...generated, ...state.transactions],
        analytics: {
          transactionsAdded: state.analytics.transactionsAdded + generated.length,
          featureUsage: {
            ...state.analytics.featureUsage,
            generate_dummy: state.analytics.featureUsage.generate_dummy + 1,
          },
        },
      };
    }),
}));
