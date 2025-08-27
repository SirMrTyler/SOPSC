import { useEffect, useState } from 'react';
import { getApp } from '@react-native-firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  orderBy,
  query,
  limit as fsLimit,
} from '@react-native-firebase/firestore';

const db = getFirestore(getApp());

/**
 * Subscribes to a conversation's messages and computes the unread count
 * for the provided user. Limits to the most recent 100 to reduce cost.
 */
export const useUnreadCount = (chatId: string, userId?: number | null) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!chatId || !userId) {
      setCount(0);
      return;
    }
    const q = query(
      collection(db, `conversations/${chatId}/messages`),
      orderBy('sentTimestamp', 'desc'),
      fsLimit(100)
    );
    const unsub = onSnapshot(q, (snap) => {
      let c = 0;
      snap.docs.forEach((d) => {
        const data = d.data() as any;
        // Count only messages not sent by current user and not marked read by them
        if (data.senderId !== userId) {
          const readBy = data.readBy || {};
          if (readBy[String(userId)] !== true) c += 1;
        }
      });
      setCount(c);
    });
    return () => unsub();
  }, [chatId, userId]);

  return count;
};

export default useUnreadCount;

