import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, doc, onSnapshot } from '@react-native-firebase/firestore';
import type { RootStackParamList } from '../../App';

const db = getFirestore(getApp());

export interface ConversationMeta {
  memberProfiles?: Record<string, {
    firstName: string;
    lastName: string;
    profilePicturePath?: string;
  }>;
  type?: 'direct' | 'group';
  unreadCount?: Record<string, number>;
}

/**
 * Subscribes to a conversation doc to keep UI metadata fresh
 * (e.g., other user's display name and avatar path).
 */
export const useConversationMeta = (chatId?: string | null) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [meta, setMeta] = useState<ConversationMeta>({});

  useEffect(() => {
    if (!chatId) return;
    const ref = doc(db, 'conversations', chatId);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('Messages');
        }
        return;
      }
      const data = snap.data() as any;
      if (!data) return;
      setMeta({
        memberProfiles: data.memberProfiles || {},
        type: data.type,
        unreadCount: data.unreadCount || {},
      });
    });
    return () => unsub();
  }, [chatId, navigation]);

  return meta;
};

export default useConversationMeta;

