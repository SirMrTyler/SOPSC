import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type TimestampLike =
// Accept either a Firestore timestamp, a native Date, or an ISO string
// so callers can pass in whatever representation they have available.
  | FirebaseFirestoreTypes.Timestamp
  | Date
  | string;

interface FormatOptions {
  includeDate?: boolean;
  includeDay?: boolean;
  includeTime?: boolean;
}

export const formatTimestamp = (
  timestamp?: TimestampLike | null,
  options: FormatOptions = { includeDate: true, includeDay: true, includeTime: true },
): string => {
  if (!timestamp) return '';
  let date: Date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    date = timestamp.toDate();
  }

  const formatOptions: Intl.DateTimeFormatOptions = {};
  if (options.includeDay) {
    formatOptions.weekday = 'short';
  }
  if (options.includeDate) {
    formatOptions.month = 'short';
    formatOptions.day = 'numeric';
  }
  if (options.includeTime) {
    formatOptions.hour = 'numeric';
    formatOptions.minute = '2-digit';
    formatOptions.hour12 = true;
  }

  return date.toLocaleString('en-US', formatOptions);
};

export type { FormatOptions };