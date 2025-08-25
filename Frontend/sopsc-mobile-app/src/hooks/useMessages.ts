import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

// Generic hook to subscribe to a Firestore collection of messages
export const useMessages = <T extends { messageId: any }>(collectionPath: string) => {
  const [messages, setMessages] = useState<T[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection(collectionPath)
      .orderBy('sentTimestamp')
      .onSnapshot(snapshot => {
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
