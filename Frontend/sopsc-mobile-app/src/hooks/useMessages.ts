import { useEffect, useState } from 'react';
import { getApp, type ReactNativeFirebase } from '@react-native-firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from '@react-native-firebase/firestore';

// Generic hook to subscribe to a Firestore collection of messages
const db = getFirestore(getApp());

export const useMessages = <T extends { messageId: any }>(collectionPath: string) => {
  const [messages, setMessages] = useState<T[]>([]);

  useEffect(() => {
    const q = query(collection(db, collectionPath), orderBy('sentTimestamp'));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        if (!snapshot) {
          setMessages([]);
          return;
        }

        const data: T[] = snapshot.docs.map(doc => {
          const raw = doc.data() as any;
          return {
            ...raw,
            messageId: doc.id,
          } as T;
        });
        setMessages(data);
      },
      error => {
        const native = error as ReactNativeFirebase.NativeFirebaseError;
        if (
          native.code === 'firestore/permission-denied' ||
          native.code === 'permission-denied'
        ) {
          console.warn('useMessages:permission-denied', collectionPath);
        } else {
          console.error('useMessages:onSnapshot', error);
        }
        setMessages([]);
      },
    );

    return () => unsubscribe();
  }, [collectionPath]);

  return messages;
};
