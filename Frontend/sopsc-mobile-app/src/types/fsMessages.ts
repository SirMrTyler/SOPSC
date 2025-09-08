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
  writeBatch,
} from '@react-native-firebase/firestore';
import type { FirebaseFirestoreTypes, Timestamp } from '@react-native-firebase/firestore';
import axios from 'axios';
import * as helper from '../components/serviceHelpers';

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
  sentTimestamp: Timestamp | string | null;
  numMessages: number;
  /** keyed by firebaseUid */
  participants: Record<string, any>;
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

/** Serializable variant of FsConversation for navigation params */
export interface FsConversationNav extends FsConversation {
  sentTimestamp: string;
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
  if (snap.exists) return; 

  const participantsMap: Record<string, { userId: number }> = {};
  const unreadMap: Record<string, number> = {};
  participants.forEach((p) => {
    participantsMap[p.firebaseUid] = { userId: p.userId };
    unreadMap[p.firebaseUid] = 0;
  });
    await setDoc(ref, {
      participants: participantsMap,
      unreadCount: unreadMap,
      mostRecentMessage: '',
      numMessages: 0,
      sentTimestamp: serverTimestamp(),
      lastSenderId: null,
      lastMessageReadBy: {},
      memberProfiles: {},
      type,
    });
  }


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
      // convenience derivations for direct chats
      let otherUserId: number | undefined;
      let otherUserName: string | undefined;
      let otherUserProfilePicturePath: string | undefined;
      if (data.type === 'direct') {
        const participantUids = Object.keys(data.participants || {});
        const otherUid = participantUids.find((uid) => uid !== user.firebaseUid);
        const other = otherUid ? data.participants?.[otherUid] : undefined;
        const profiles = data.memberProfiles || {};
        const profile = other?.userId != null ? profiles[String(other.userId)] : undefined;
        otherUserId = other?.userId;
        otherUserName = profile ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() : undefined;
        otherUserProfilePicturePath = profile?.profilePicturePath;
      }

      return {
        ...(data as any),
        chatId: d.id,
        sentTimestamp: data.sentTimestamp?.toDate?.() ?? data.sentTimestamp ?? null,
        otherUserId,
        otherUserName,
        otherUserProfilePicturePath,
      } as FsConversation;
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
  
  // Keep participant + profile data on the conversation doc
  const participantUpdates: Record<string, any> = {};
  const memberProfileUpdates: Record<string, any> = {};
  allParticipants.forEach((p) => {
    participantUpdates[`participants.${p.firebaseUid}.userId`] = p.userId;
    if ((p as any).firstName) {
      memberProfileUpdates[`memberProfiles.${String(p.userId)}.firstName`] = (p as any).firstName;
    }
    if ((p as any).lastName) {
      memberProfileUpdates[`memberProfiles.${String(p.userId)}.lastName`] = (p as any).lastName;
    }
    if ((p as any).profilePicturePath) {
      memberProfileUpdates[`memberProfiles.${String(p.userId)}.profilePicturePath`] = (p as any).profilePicturePath;
    }
  });

  // Per-user unread counters — clear for sender, increment for recipients
  const unreadUpdates: Record<string, any> = {
    [`unreadCount.${sender.firebaseUid}`]: 0,
  };
  for (const r of recipients) {
    unreadUpdates[`unreadCount.${r.firebaseUid}`] = increment(1);
  }

  // 1) add the message to subcollection
  const msgCol = collection(db, `conversations/${chatId}/messages`);
  await addDoc(msgCol, {
    messageContent: content,
    senderId: sender.userId,
    senderName: `${sender.firstName ?? ''} ${sender.lastName ?? ''}`.trim(),
    sentTimestamp: serverTimestamp(),
    readTimestamp: null,
    isRead: false, // legacy flag if referenced elsewhere
    readBy: { [sender.firebaseUid]: true }, // sender has read it
    recipients: recipients.reduce<Record<string, boolean>>(
      (acc, r) => ((acc[r.firebaseUid] = true), acc),
      {}
    ),
    type,
  });

  // 2) update the parent conversation metadata
  await updateDoc(doc(db, 'conversations', chatId), {
    ...participantUpdates,
    ...memberProfileUpdates,
    ...unreadUpdates,
    type,
    lastSenderId: sender.userId,
    lastMessageReadBy: { [sender.firebaseUid]: true }, // who's read the latest
    mostRecentMessage: content,
    numMessages: increment(1),
    sentTimestamp: serverTimestamp(),
  });
// Push notifications are published by the FirestoreMessageListener backend service.
};


/** Mark conversation and messages read for the user */
export const markConversationRead = async (
  chatId: string,
  user: { userId: number; firebaseUid: string },
  messages: FsMessage[]
): Promise<void> => {
  // Clear THIS user's unread badge and set lastMessageReadBy if last msg is from others
  const last = messages.length ? messages[messages.length - 1] : undefined;
  const convPatch: Record<string, any> = {
    [`unreadCount.${user.firebaseUid}`]: 0,
  };
  if (last && last.senderId !== user.userId) {
    convPatch[`lastMessageReadBy.${user.firebaseUid}`] = true;
  }

  const batch = writeBatch(db);

  // 1) update conversation doc
  const convRef = doc(db, 'conversations', chatId);
  batch.update(convRef, convPatch);

  // 2) mark each message from others as read-by-me if not already
  for (const m of messages) {
    if (m.senderId === user.userId) continue;
    if (m.readBy && m.readBy[user.firebaseUid]) continue;
    const msgRef = doc(db, `conversations/${chatId}/messages`, m.messageId);
    batch.update(msgRef, { [`readBy.${user.firebaseUid}`]: true });
  }

  await batch.commit();
};

export default {
  getFsConversation,
  ensureConversationDoc,
  sendMessage,
  listenToMyConversations,
  listenToConversationMessages,
  markConversationRead,
};

