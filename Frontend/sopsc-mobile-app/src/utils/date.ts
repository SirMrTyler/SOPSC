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

export const toIso = (
    v:
      | string
      | number
      | Date
      | FirebaseFirestoreTypes.Timestamp
      | null
      | undefined
  ): string => {
    if (v == null) return ""; // or new Date().toISOString()
    if (typeof v === "string") return v;
    if (typeof v === "number") return new Date(v).toISOString();
    // Firestore Timestamp from RN Firebase has .toDate()
    const d = (v as any)?.toDate?.() ?? (v instanceof Date ? v : null);
    return (d ?? new Date()).toISOString();
};

type FormatOpts = {
  includeDay?: boolean;
  includeDate?: boolean;
  includeTime?: boolean;
};

export const formatTimestamp = (
  v: string | number | Date | FirebaseFirestoreTypes.Timestamp | null | undefined,
  opts: FormatOpts = { includeDay: false, includeDate: true, includeTime: true }
): string => {
  const iso = toIso(v);
  if (!iso) return '';
  const d = new Date(iso);

  // tweak to your taste:
  const parts: string[] = [];
  if (opts.includeDay) parts.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
  if (opts.includeDate) parts.push(d.toLocaleDateString());
  if (opts.includeTime) parts.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  return parts.join(' ');
};

export type { FormatOptions };