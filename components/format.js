// Shared price formatting — plain module (no 'use client'), safe to import
// from both server and client components.

export function formatPrice(value) {
  if (typeof value !== 'number') return 'TBA';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
