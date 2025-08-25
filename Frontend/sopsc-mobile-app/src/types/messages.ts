export interface MessageConversation {
  messageId: string;
  chatId: string;
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
  messageId: string;
  chatId: string;
  senderId: number;
  senderName: string;
  messageContent: string;
  sentTimestamp: string;
  readTimestamp: string | null;
  isRead: boolean;
}

export interface MessageCreated {
  id: string;
  chatId: string;
}