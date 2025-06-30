export interface MessageConversation {
  messageId: number;
  otherUserId: number;
  otherUserName: string;
  otherUserProfilePicturePath: string;
  mostRecentMessage: string;
  isRead: boolean;
  sentTimestamp: string;
  numMessages: number;
  isLastMessageFromUser: boolean;
}

export interface Message {
  messageId: number;
  senderId: number;
  senderName: string;
  recipientId: number;
  recipientName: string;
  messageContent: string;
  sentTimestamp: string;
  readTimestamp: string | null;
  isRead: boolean;
}