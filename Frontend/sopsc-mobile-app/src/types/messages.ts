export interface MessageConversation {
  messageId: number;
  chatId: number;
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
  chatId: number;
  senderId: number;
  senderName: string;
  messageContent: string;
  sentTimestamp: string;
  readTimestamp: string | null;
  isRead: boolean;
}

export interface MessageCreated {
  id: number;
  chatId: number;
}