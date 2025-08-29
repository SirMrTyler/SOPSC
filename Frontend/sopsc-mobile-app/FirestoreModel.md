# Firestore Data Model

```text
conversations/{conversationId}
  participants: { [uid]: { userId } }
  memberProfiles: { [userId]: { firstName, lastName, profilePicturePath } }
  lastSenderId: number
  lastSenderName: string
  lastSenderPicturePath: string
  mostRecentMessage: string
  numMessages: number
  sentTimestamp: Timestamp
  unreadCount: { [uid]: number }
  type: "direct" | "group"
  messages/{messageId}
    senderId: number
    senderName: string
    senderProfilePicturePath: string
    messageContent: string
    sentTimestamp: Timestamp
    readBy: { [uid]: Timestamp | true }
    recipients: { [uid]: true }
    type: "direct" | "group"
```

Each message document tracks read receipts using the `readBy` map where the key is a user id and the value is the timestamp the message was read. Direct and group messages share this structure; only the `type` field differs.
