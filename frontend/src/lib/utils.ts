// Purpose: Class Name Merging, Currency/Date Formatting & Status Badge Mapping Utilities
// Path: frontend/src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'; import { twMerge } from 'tailwind-merge'; import { format, parseISO } from 'date-fns';
/**  * Merges CSS class names safely using clsx and tailwind-merge.  * Solves class specificity conflicts in Tailwind components.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs)); }
/**  * Formats a numeric value into a localized currency string.  * Defaults to INR (₹) for garment manufacturing operations.
 */
export function formatCurrency(
  amount: number,   currency: string = 'INR',   locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',     currency: currency,     minimumFractionDigits: 2,     maximumFractionDigits: 2
  }).format(amount || 0);
}
/**  * Formats an ISO date string or Date object into a readable date string.
 * Example: '2026-07-24' -> '24 Jul 2026'
 */
export function formatDate(
  dateInput: string | Date | null | undefined,
  dateFormat: string = 'dd MMM yyyy'
): string {
  if (!dateInput) return 'N/A';
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return format(date, dateFormat);
  } catch (error) {     return 'Invalid Date';
  }
}
/**  * Maps operational status keys to corresponding Tailwind badge utility classes.
 */
export function getStatusBadgeClass(status: string): string {
  const normalizedStatus = (status || '').toUpperCase();
  switch (normalizedStatus) {     case 'PENDING':     case 'DRAFT':     case 'ASSIGNED':
      return 'badge-pending';     case 'IN_PROGRESS':
    case 'CUTTING':     case 'STITCHING':     case 'FINISHING':
      return 'badge-in-progress';     case 'COMPLETED':
    case 'PAID':     case 'APPROVED':
      return 'badge-completed';     case 'CANCELLED':     case 'REJECTED':       return 'badge-cancelled';     default:       return 'bg-secondary text-secondary-foreground border-border';
  }
}
/**  * Capitalizes and replaces underscores in status/role strings for UI display.
 * Example: 'IN_PROGRESS' -> 'In Progress'
 */
export function formatStatusLabel(label: string): string {
  if (!label) return '';
  return label
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
