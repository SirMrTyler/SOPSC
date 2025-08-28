# Firestore Data Model

```text
conversations/{conversationId}
  participants: { [userId]: true }
  memberProfiles: { [userId]: { firstName, lastName, profilePicturePath } }
  lastSenderId: number
  lastSenderName: string
  lastSenderPicturePath: string
  mostRecentMessage: string
  numMessages: number
  sentTimestamp: Timestamp
  unreadCount: { [userId]: number }
  type: "direct" | "group"
  messages/{messageId}
    senderId: number
    senderName: string
    senderProfilePicturePath: string
    messageContent: string
    sentTimestamp: Timestamp
    readBy: { [userId]: Timestamp | true }
    recipients: { [userId]: true }
    type: "direct" | "group"
```

Each message document tracks read receipts using the `readBy` map where the key is a user id and the value is the timestamp the message was read. Direct and group messages share this structure; only the `type` field differs.
