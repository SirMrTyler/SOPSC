import { getApp } from '@react-native-firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  getDoc,
} from '@react-native-firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

/** Firestore conversation type */
export interface FsConversation {
  messageId: string;
  chatId: string;
  otherUserId: number;
  otherUserName: string;
  otherUserProfilePicturePath: string;
  mostRecentMessage: string;
  isRead: boolean;
  sentTimestamp: Date | null;
  numMessages: number;
  isLastMessageFromUser: boolean;
}

/** Firestore message type */
export interface FsMessage {
  messageId: string;
  chatId: string;
  senderId: number;
  senderName: string;
  messageContent: string;
  sentTimestamp: Date | null;
  readTimestamp?: Date | null;
  isRead: boolean;
  readBy?: Record<string, boolean>;
}

const db = getFirestore(getApp());

/** Retrieve a conversation by id */
export const getFsConversation = async (
  chatId: string
): Promise<FsConversation | null> => {
  const snap = await getDoc(doc(db, 'conversations', chatId));
  if (!snap.exists) return null;
  const data = snap.data() as FirebaseFirestoreTypes.DocumentData;
  return {
    messageId: data.lastMessageId || '',
    chatId: snap.id,
    otherUserId: data.otherUserId,
    otherUserName: data.otherUserName,
    otherUserProfilePicturePath: data.otherUserProfilePicturePath || '',
    mostRecentMessage: data.mostRecentMessage || '',
    isRead: data.isRead,
    sentTimestamp: data.sentTimestamp?.toDate() ?? null,
    numMessages: data.numMessages || 0,
    isLastMessageFromUser: data.isLastMessageFromUser || false,
  };
};

/** Subscribe to the current user's conversations */
export const listenToMyConversations = (
  userId: number,
  cb: (convos: FsConversation[]) => void
) => {
  const q = query(
    collection(db, 'conversations'),
    where(`participants.${userId}`, '==', true)
  );
  return onSnapshot(q, (snapshot) => {
    const list: FsConversation[] = snapshot.docs.map((d) => {
      const data = d.data() as FirebaseFirestoreTypes.DocumentData;
      return {
        messageId: data.lastMessageId || '',
        chatId: d.id,
        otherUserId: data.otherUserId,
        otherUserName: data.otherUserName,
        otherUserProfilePicturePath: data.otherUserProfilePicturePath || '',
        mostRecentMessage: data.mostRecentMessage || '',
        isRead: data.isRead,
        sentTimestamp: data.sentTimestamp?.toDate() ?? null,
        numMessages: data.numMessages || 0,
        isLastMessageFromUser: data.isLastMessageFromUser || false,
      };
    });
    cb(list);
  });
};

/** Subscribe to messages within a conversation */
export const listenToConversationMessages = (
  chatId: string,
  cb: (msgs: FsMessage[]) => void
) => {
  const q = query(
    collection(db, `conversations/${chatId}/messages`),
    orderBy('sentTimestamp')
  );
  return onSnapshot(q, (snapshot) => {
    const msgs: FsMessage[] = snapshot.docs.map((d) => {
      const data = d.data() as FirebaseFirestoreTypes.DocumentData;
      return {
        ...(data as any),
        sentTimestamp: data.sentTimestamp?.toDate() ?? null,
        readTimestamp: data.readTimestamp?.toDate() ?? null,
        messageId: d.id,
        chatId,
      } as FsMessage;
    });
    cb(msgs);
  });
};

/** Send a message to a conversation */
export const sendMessage = async (
  chatId: string,
  sender: { userId: number; firstName: string; lastName: string },
  content: string
): Promise<void> => {
  const msgRef = await addDoc(
    collection(db, `conversations/${chatId}/messages`),
    {
      senderId: sender.userId,
      senderName: `${sender.firstName} ${sender.lastName}`,
      messageContent: content,
      sentTimestamp: serverTimestamp(),
      readBy: { [sender.userId]: true },
      isRead: false,
    }
  );
  await updateDoc(doc(db, 'conversations', chatId), {
    mostRecentMessage: content,
    lastMessageId: msgRef.id,
    sentTimestamp: serverTimestamp(),
    isLastMessageFromUser: true,
    isRead: false,
  });
};

/** Mark conversation and messages read for the user */
export const markConversationRead = async (
  chatId: string,
  userId: number,
  messages: FsMessage[]
): Promise<void> => {
  await updateDoc(doc(db, 'conversations', chatId), {
    [`readBy.${userId}`]: true,
    isRead: true,
  });
  await Promise.all(
    messages.map((m) => {
      if (!m.readBy || !m.readBy[userId]) {
        return updateDoc(
          doc(db, `conversations/${chatId}/messages`, m.messageId),
          {
            [`readBy.${userId}`]: true,
            isRead: true,
          }
        );
      }
      return Promise.resolve();
    })
  );
};

export default {
  getFsConversation,
  sendMessage,
  listenToMyConversations,
  listenToConversationMessages,
  markConversationRead,
};

