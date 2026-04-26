export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

export const formatDateLabel = (value: Date) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(value);

export const formatShortDate = (value: Date) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
  }).format(value);

export const cleanNumberInput = (value: string) => value.replace(/[^0-9]/g, '');
