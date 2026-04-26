import { FEATURE_KEYS, FeatureUsageMap, ReportFilter, Transaction } from '../types/finance';

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const isSameMonth = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();

export const createDefaultFeatureUsage = (): FeatureUsageMap =>
  FEATURE_KEYS.reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: 0,
    }),
    {} as FeatureUsageMap
  );

export const getCurrentMonthExpense = (
  transactions: Transaction[],
  referenceDate: Date = new Date()
) =>
  transactions
    .filter(
      (transaction) =>
        transaction.type === 'expense' && isSameMonth(new Date(transaction.date), referenceDate)
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

export const calculateDashboardSummary = (
  transactions: Transaction[],
  budgetLimit: number,
  referenceDate: Date = new Date()
) => {
  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const budgetUsed = getCurrentMonthExpense(transactions, referenceDate);
  const budgetRemaining = budgetLimit - budgetUsed;

  return {
    income,
    expense,
    balance: income - expense,
    budgetUsed,
    budgetRemaining,
    budgetProgress: budgetLimit > 0 ? Math.min(budgetUsed / budgetLimit, 1) : 0,
  };
};

export const filterTransactionsByRange = (
  transactions: Transaction[],
  filter: ReportFilter,
  referenceDate: Date = new Date()
) => {
  const now = referenceDate.getTime();
  const oneDayInMs = 24 * 60 * 60 * 1000;

  const filtered = transactions.filter((transaction) => {
    const valueDate = new Date(transaction.date);

    if (filter === 'daily') {
      return isSameDay(valueDate, referenceDate);
    }

    if (filter === 'weekly') {
      return valueDate.getTime() >= now - oneDayInMs * 6;
    }

    return isSameMonth(valueDate, referenceDate);
  });

  return filtered.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
};

export const getCategoryBreakdown = (transactions: Transaction[]) => {
  const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense');

  const totalExpense = expenseTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  if (totalExpense === 0) {
    return [];
  }

  const grouped = expenseTransactions.reduce<Record<string, number>>((accumulator, transaction) => {
    const previous = accumulator[transaction.category] ?? 0;
    return {
      ...accumulator,
      [transaction.category]: previous + transaction.amount,
    };
  }, {});

  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: amount / totalExpense,
    }))
    .sort((left, right) => right.amount - left.amount);
};

export const getTrendData = (transactions: Transaction[], filter: ReportFilter) => {
  const expenses = transactions.filter((transaction) => transaction.type === 'expense');

  if (filter === 'daily') {
    const buckets = [
      { label: 'Pagi', min: 5, max: 11 },
      { label: 'Siang', min: 11, max: 15 },
      { label: 'Sore', min: 15, max: 19 },
      { label: 'Malam', min: 19, max: 24 },
    ];

    return buckets.map((bucket) => {
      const value = expenses
        .filter((transaction) => {
          const hour = new Date(transaction.date).getHours();
          return hour >= bucket.min && hour < bucket.max;
        })
        .reduce((total, transaction) => total + transaction.amount, 0);

      return {
        label: bucket.label,
        value,
      };
    });
  }

  if (filter === 'weekly') {
    const labels = ['M1', 'S2', 'S3', 'R4', 'K5', 'J6', 'S7'];

    return labels.map((label, index) => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - (6 - index));

      const value = expenses
        .filter((transaction) => isSameDay(new Date(transaction.date), targetDate))
        .reduce((total, transaction) => total + transaction.amount, 0);

      return {
        label,
        value,
      };
    });
  }

  const bins = ['M1', 'M2', 'M3', 'M4', 'M5'];

  return bins.map((label, index) => {
    const weekIndex = index + 1;
    const value = expenses
      .filter((transaction) => {
        const dayOfMonth = new Date(transaction.date).getDate();
        const transactionWeek = Math.min(Math.ceil(dayOfMonth / 7), 5);
        return transactionWeek === weekIndex;
      })
      .reduce((total, transaction) => total + transaction.amount, 0);

    return {
      label,
      value,
    };
  });
};

export const getMostUsedFeature = (featureUsage: FeatureUsageMap) => {
  const sorted = Object.entries(featureUsage).sort((left, right) => right[1] - left[1]);

  const [feature, count] = sorted[0] ?? [];

  if (!feature || count === 0) {
    return null;
  }

  return {
    key: feature as keyof FeatureUsageMap,
    count,
  };
};
