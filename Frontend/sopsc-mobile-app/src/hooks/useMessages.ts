import { useEffect, useState } from 'react';
import {getApp} from '@react-native-firebase/app';
import {getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp} from '@react-native-firebase/firestore';

// Generic hook to subscribe to a Firestore collection of messages
const db = getFirestore(getApp());

export const useMessages = <T extends { messageId: any }>(collectionPath: string) => {
  const [messages, setMessages] = useState<T[]>([]);

  useEffect(() => {
    const q = query(collection(db, collectionPath), orderBy('sentTimestamp'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const data: T[] = snapshot.docs.map(doc => {
        const raw = doc.data() as any;
        return {
          ...raw,
          messageId: doc.id,
        } as T;
      });
      setMessages(data);
    });

    return () => unsubscribe();
  }, [collectionPath]);

  return messages;
};
