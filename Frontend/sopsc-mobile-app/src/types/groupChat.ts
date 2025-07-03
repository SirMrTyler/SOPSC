export interface GroupChatSummary {
  groupChatId: number;
  name: string;
  lastMessage: string;
  lastSentTimestamp: string;
  unreadCount: number;
}

export interface GroupChatMessage {
  messageId: number;
  groupChatId: number;
  senderId: number;
  senderName: string;
  messageContent: string;
  sentTimestamp: string;
  readTimestamp: string | null;
  isRead: boolean;
}

export interface GroupChatMember {
  userId: number;
  firstName: string;
  lastName: string;
  roleId: number;
}