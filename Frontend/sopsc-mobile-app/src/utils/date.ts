import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

type TimestampInput =
  | FirebaseFirestoreTypes.Timestamp
  | Date
  | string;

export const formatTimestamp = (
  timestamp?: TimestampInput | null,
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
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};