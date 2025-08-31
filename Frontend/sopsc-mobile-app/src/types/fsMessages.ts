import { getApp } from '@react-native-firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
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
  sentTimestamp: string | null;
  numMessages: number;
  /** keyed by firebaseUid */
  participants: Record<string, { userId: number }>;
  /** userId of the last message sender */
  lastSenderId?: number;
  /** UID-keyed map of who read the last message */
  lastMessageReadBy?: Record<string, boolean>;
  memberProfiles: Record<string, MemberProfile>;
  /** keyed by firebaseUid */
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
  /** keyed by firebaseUid */
  readBy?: Record<string, boolean>;
  /** keyed by firebaseUid */
  recipients: Record<string, boolean>;
  type: 'direct' | 'group';
}

const db = getFirestore(getApp());

/** Ensure a conversation doc exists with its participants map */
export const ensureConversationDoc = async (
  chatId: string,
  participants: { userId: number; firebaseUid: string }[],
  type: 'direct' | 'group',
): Promise<void> => {
  const ref = doc(db, 'conversations', chatId);
  const snap = await getDoc(ref);
  if (!snap.exists) {
    const partMap: Record<string, { userId: number }> = {};
    const unread: Record<string, number> = {};
    participants.forEach((p) => {
      partMap[p.firebaseUid] = { userId: p.userId };
      unread[p.firebaseUid] = 0;
    });
    await setDoc(ref, {
      participants: partMap,
      unreadCount: unread,
      memberProfiles: {},
      numMessages: 0,
      mostRecentMessage: '',
      sentTimestamp: serverTimestamp(),
      type,
    });
  }
};

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
    lastSenderId: data.lastSenderId,
    lastMessageReadBy: data.lastMessageReadBy || {},
    type: data.type || 'direct',
    otherUserId,
    otherUserName,
    otherUserProfilePicturePath,
  };
};

/** Subscribe to the current user's conversations */
export const listenToMyConversations = (
  user: { userId: number; firebaseUid: string },
  cb: (convos: FsConversation[]) => void
) => {
  const q = query(
    collection(db, 'conversations'),
    where(`participants.${user.firebaseUid}.userId`, '==', user.userId)
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
          Object.keys(memberProfiles).find(
            (id) => Number(id) !== user.userId
          )
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
        lastSenderId: data.lastSenderId,
        lastMessageReadBy: data.lastMessageReadBy || {},
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
    firebaseUid: string;
    firstName: string;
    lastName: string;
    profilePicturePath?: string;
  },
  content: string,
  type: 'direct' | 'group',
  recipients: { userId: number; firebaseUid: string }[]
): Promise<void> => {
  const allParticipants = [...recipients, sender];
  await ensureConversationDoc(chatId, allParticipants, type);

  const recipientMap: Record<string, boolean> = {};
  const participantUpdates: Record<string, any> = {};
  const unreadUpdates: Record<string, any> = {};
  allParticipants.forEach(({ userId, firebaseUid }) => {
    participantUpdates[`participants.${firebaseUid}`] = { userId };
    unreadUpdates[`unreadCount.${firebaseUid}`] = increment(0);
  });
  recipients.forEach(({ firebaseUid }) => {
    recipientMap[firebaseUid] = true;
    unreadUpdates[`unreadCount.${firebaseUid}`] = increment(1);
  });
  await addDoc(
    collection(db, `conversations/${chatId}/messages`),
    {
      senderId: sender.userId,
      senderName: `${sender.firstName} ${sender.lastName}`,
      senderProfilePicturePath: sender.profilePicturePath || '',
      messageContent: content,
      sentTimestamp: serverTimestamp(),
      readBy: { [sender.firebaseUid]: true },
      recipients: recipientMap,
      type,
    }
  );

  await updateDoc(doc(db, 'conversations', chatId), {
    lastSenderId: sender.userId,
    lastSenderName: `${sender.firstName} ${sender.lastName}`,
    lastSenderPicturePath: sender.profilePicturePath || '',
    lastMessageReadBy: { [sender.firebaseUid]: true },
    mostRecentMessage: content,
    numMessages: increment(1),
    sentTimestamp: serverTimestamp(),
    type,
    ...participantUpdates,
    ...unreadUpdates,
  });
};

/** Mark conversation and messages read for the user */
export const markConversationRead = async (
  chatId: string,
  user: { userId: number; firebaseUid: string },
  messages: FsMessage[]
): Promise<void> => {
  await updateDoc(doc(db, 'conversations', chatId), {
    [`unreadCount.${user.firebaseUid}`]: 0,
    [`lastMessageReadBy.${user.firebaseUid}`]: true,
  });
  await Promise.all(
    messages.map((m) => {
      if (!m.readBy || !m.readBy[user.firebaseUid]) {
        return updateDoc(doc(db, `conversations/${chatId}/messages`, m.messageId), {
          [`readBy.${user.firebaseUid}`]: true,
        });
      }
      return Promise.resolve();
    })
  );
};

export default {
  getFsConversation,
  ensureConversationDoc,
  sendMessage,
  listenToMyConversations,
  listenToConversationMessages,
  markConversationRead,
};

