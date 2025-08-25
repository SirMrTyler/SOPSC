import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface MessageConversation {
  messageId: string;
  chatId: string;
  otherUserId: number;
  otherUserName: string;
  otherUserProfilePicturePath: string;
  mostRecentMessage: string;
  isRead: boolean;
  sentTimestamp: FirebaseFirestoreTypes.Timestamp | string | null;
  numMessages: number;
  isLastMessageFromUser: boolean;
}

export interface Message {
  messageId: string;
  chatId: string;
  senderId: number;
  senderName: string;
  messageContent: string;
  sentTimestamp: FirebaseFirestoreTypes.Timestamp | string | null;
  readTimestamp: string | null;
  isRead: boolean;
  readBy?: Record<string, boolean>;
}

export interface MessageCreated {
  id: string;
  chatId: string;
}