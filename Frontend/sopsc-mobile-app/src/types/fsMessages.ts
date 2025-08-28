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
  increment,
} from '@react-native-firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

/** Participant profile information */
export interface MemberProfile {
  firstName: string;
  lastName: string;
  profilePicturePath?: string;
}

/** Firestore conversation type */
export interface FsConversation {
  chatId: string;
  mostRecentMessage: string;
  sentTimestamp: Date | null;
  numMessages: number;
  participants: Record<string, boolean>;
  memberProfiles: Record<string, MemberProfile>;
  unreadCount: Record<string, number>;
  type: 'direct' | 'group';
  otherUserId?: number;
  otherUserName?: string;
  otherUserProfilePicturePath?: string;
}

/** Firestore message type */
export interface FsMessage {
  messageId: string;
  chatId: string;
  senderId: number;
  senderName: string;
  senderProfilePicturePath?: string;
  messageContent: string;
  sentTimestamp: Date | null;
  readTimestamp?: Date | null;
  readBy?: Record<string, boolean>;
  recipients: Record<string, boolean>;
  type: 'direct' | 'group';
}

const db = getFirestore(getApp());

/** Retrieve a conversation by id */
export const getFsConversation = async (
  chatId: string,
  currentUserId: number
): Promise<FsConversation | null> => {
  const snap = await getDoc(doc(db, 'conversations', chatId));
  if (!snap.exists) return null;
  const data = snap.data() as FirebaseFirestoreTypes.DocumentData;
  const memberProfiles = data.memberProfiles || {};
  let otherUserId: number | undefined;
  let otherUserName = '';
  let otherUserProfilePicturePath = '';
  if (data.type === 'direct') {
    otherUserId = Number(
      Object.keys(memberProfiles).find((id) => Number(id) !== currentUserId)
    );
    const prof = memberProfiles[String(otherUserId)];
    if (prof) {
      otherUserName = `${prof.firstName} ${prof.lastName}`.trim();
      otherUserProfilePicturePath = prof.profilePicturePath || '';
    }
  }
  return {
    chatId: snap.id,
    mostRecentMessage: data.mostRecentMessage || '',
    sentTimestamp: data.sentTimestamp?.toDate() ?? null,
    numMessages: data.numMessages || 0,
    participants: data.participants || {},
    memberProfiles,
    unreadCount: data.unreadCount || {},
    type: data.type || 'direct',
    otherUserId,
    otherUserName,
    otherUserProfilePicturePath,
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
      const memberProfiles = data.memberProfiles || {};
      let otherUserId: number | undefined;
      let otherUserName = '';
      let otherUserProfilePicturePath = '';
      if (data.type === 'direct') {
        otherUserId = Number(
          Object.keys(memberProfiles).find((id) => Number(id) !== userId)
        );
        const prof = memberProfiles[String(otherUserId)];
        if (prof) {
          otherUserName = `${prof.firstName} ${prof.lastName}`.trim();
          otherUserProfilePicturePath = prof.profilePicturePath || '';
        }
      } else {
        otherUserName = data.name || 'Group Chat';
      }
      return {
        chatId: d.id,
        mostRecentMessage: data.mostRecentMessage || '',
        sentTimestamp: data.sentTimestamp?.toDate() ?? null,
        numMessages: data.numMessages || 0,
        participants: data.participants || {},
        memberProfiles,
        unreadCount: data.unreadCount || {},
        type: data.type || 'direct',
        otherUserId,
        otherUserName,
        otherUserProfilePicturePath,
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
  sender: {
    userId: number;
    firstName: string;
    lastName: string;
    profilePicturePath?: string;
  },
  content: string,
  type: 'direct' | 'group',
  recipientIds: number[]
): Promise<void> => {
  const recipientMap: Record<string, boolean> = {};
  const unreadUpdates: Record<string, any> = {};
  recipientIds.forEach((id) => {
    recipientMap[String(id)] = true;
    if (id !== sender.userId) {
      unreadUpdates[`unreadCount.${id}`] = increment(1);
    }
  });
  const msgRef = await addDoc(
    collection(db, `conversations/${chatId}/messages`),
    {
      senderId: sender.userId,
      senderName: `${sender.firstName} ${sender.lastName}`,
      senderProfilePicturePath: sender.profilePicturePath || '',
      messageContent: content,
      sentTimestamp: serverTimestamp(),
      readBy: { [String(sender.userId)]: true },
      recipients: recipientMap,
      type,
    }
  );
  await updateDoc(doc(db, 'conversations', chatId), {
    lastSenderId: sender.userId,
    lastSenderName: `${sender.firstName} ${sender.lastName}`,
    lastSenderPicturePath: sender.profilePicturePath || '',
    mostRecentMessage: content,
    numMessages: increment(1),
    sentTimestamp: serverTimestamp(),
    type,
    ...unreadUpdates,
  });
};

/** Mark conversation and messages read for the user */
export const markConversationRead = async (
  chatId: string,
  userId: number,
  messages: FsMessage[]
): Promise<void> => {
  await updateDoc(doc(db, 'conversations', chatId), {
    [`unreadCount.${userId}`]: 0,
  });
  await Promise.all(
    messages.map((m) => {
      if (!m.readBy || !m.readBy[String(userId)]) {
        return updateDoc(doc(db, `conversations/${chatId}/messages`, m.messageId), {
          [`readBy.${userId}`]: true,
        });
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

