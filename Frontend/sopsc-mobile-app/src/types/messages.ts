export interface MessageConversation {
  messageId: number;
  otherUserId: number;
  otherUserName: string;
  otherUserProfilePicturePath: string;
  mostRecentMessage: string;
  isRead: boolean;
  sentTimestamp: string;
  numMessages: number;
}