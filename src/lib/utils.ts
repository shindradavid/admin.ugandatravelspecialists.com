import { parsePhoneNumberWithError } from 'libphonenumber-js';
import { format } from 'date-fns';

export const toLabel = (value: string) => value.replace(/\b\w/g, (char) => char.toUpperCase());

export const capitalizeWords = (str: string) => {
  return str
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
};

// Date utils
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const humanizeDate = (date: Date) => format(date, 'LLLL do yyyy');

// Currency
export function formatCurrency(amount: number, currencyCode: string = 'UGX', locale: string = 'en-US'): string {
  return amount?.toLocaleString(locale, {
    style: 'currency',
    currency: currencyCode,
  });
}

export const combineDateAndTime = (date: Date, time: string): string => {
  return `${format(date, 'yyyy-MM-dd')}T${time}`;
};

export const normalizePhoneNumber = (raw: string): string => {
  try {
    // Remove all spaces and non-digit characters except '+' (e.g., "+256 782 346200" => "+256782346200")
    const cleaned = raw.replace(/[^\d+]/g, '');

    const phoneNumber = parsePhoneNumberWithError(cleaned, 'UG');
    if (!phoneNumber.isValid()) {
      throw new Error('Invalid phone number');
    }
    return phoneNumber.number; // Returns in E.164 format, e.g., +256782346200
  } catch (error) {
    throw new Error('Invalid phone number format');
  }
};
