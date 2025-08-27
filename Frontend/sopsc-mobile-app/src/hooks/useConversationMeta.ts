import { useEffect, useState } from 'react';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, doc, onSnapshot } from '@react-native-firebase/firestore';

const db = getFirestore(getApp());

export interface ConversationMeta {
  otherUserName?: string;
  otherUserProfilePicturePath?: string;
}

/**
 * Subscribes to a conversation doc to keep UI metadata fresh
 * (e.g., other user's display name and avatar path).
 */
export const useConversationMeta = (chatId?: string | null) => {
  const [meta, setMeta] = useState<ConversationMeta>({});

  useEffect(() => {
    if (!chatId) return;
    const ref = doc(db, 'conversations', chatId);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists) return;
      const data = snap.data() as any;
      setMeta({
        otherUserName: data.otherUserName,
        otherUserProfilePicturePath: data.otherUserProfilePicturePath,
      });
    });
    return () => unsub();
  }, [chatId]);

  return meta;
};

export default useConversationMeta;

