# Firestore Data Model

```text
conversations/{conversationId}
  participants: { [userId]: true }
  otherUserId: number
  otherUserName: string
  mostRecentMessage: string
  sentTimestamp: Timestamp
  ...
  messages/{messageId}
    senderId: number
    senderName: string
    messageContent: string
    sentTimestamp: Timestamp
    readBy: { [userId]: Timestamp }

groupChats/{chatId}
  name: string
  members: { [userId]: true }
  messages/{messageId}
    groupChatId: string
    senderId: number
    senderName: string
    messageContent: string
    sentTimestamp: Timestamp
    readBy: { [userId]: Timestamp }
```

Each message document tracks read receipts using the `readBy` map where the key is a user id and the value is the timestamp the message was read.
