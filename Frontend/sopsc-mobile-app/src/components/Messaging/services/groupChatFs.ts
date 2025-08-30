import { getApp } from '@react-native-firebase/app';
import {
  getFirestore,
  doc,
  updateDoc,
  setDoc,
  collection,
} from '@react-native-firebase/firestore';
import {
  sendMessage as fsSendMessage,
  listenToMyConversations,
  type FsConversation,
} from '../../../types/fsMessages';

const db = getFirestore(getApp());

export interface Participant {
  userId: number;
  firebaseUid: string;
  firstName: string;
  lastName: string;
  profilePicturePath?: string;
}

/**
 * Create a new group conversation document and return its chat id.
 */
export const createGroup = async (
  name: string,
  creator: Participant,
): Promise<string> => {
  const ref = doc(collection(db, 'conversations'));
  const chatId = ref.id;
  const partMap = { [creator.firebaseUid]: { userId: creator.userId } }; 
  const unread = { [creator.firebaseUid]: 0 }; 
  await setDoc( 
    ref,
    { 
      name, 
      type: 'group', 
      participants: partMap, 
      unreadCount: unread, 
      memberProfiles: { 
        [creator.userId]: { 
          firstName: creator.firstName, 
          lastName: creator.lastName, 
          profilePicturePath: creator.profilePicturePath || '', 
        },
      },
    },
    { merge: true }, 
  );
  return chatId;
};

/**
 * Add members to an existing group conversation.
 */
export const addMembers = async (
  chatId: string,
  members: Participant[],
): Promise<void> => {
  const ref = doc(db, 'conversations', chatId);
  const updates: Record<string, any> = { type: 'group' };
  members.forEach((m) => {
    updates[`participants.${m.firebaseUid}`] = { userId: m.userId };
    updates[`unreadCount.${m.firebaseUid}`] = 0;
    updates[`memberProfiles.${m.userId}`] = {
      firstName: m.firstName,
      lastName: m.lastName,
      profilePicturePath: m.profilePicturePath || '',
    };
  });
  await updateDoc(ref, updates);
};

/**
 * Subscribe to group conversations for the current user.
 */
export const listenToGroupChats = (
  user: { userId: number; firebaseUid: string },
  cb: (convos: FsConversation[]) => void,
) =>
  listenToMyConversations(user, (convos) =>
    cb(convos.filter((c) => c.type === 'group')),
  );

/**
 * Send a message to a group conversation.
 */
export const sendMessage = async (
  chatId: string,
  sender: Participant,
  content: string,
  recipients: { userId: number; firebaseUid: string }[],
): Promise<void> => {
  await fsSendMessage(chatId, sender, content, 'group', recipients);
};

export default {
  createGroup,
  addMembers,
  listenToGroupChats,
  sendMessage,
};

