# Push Notification Payloads

Chat message notifications sent by the API include a `data` object so the mobile client can deep link into the conversation. The payload posted to Expo (and any FCM/APNs fallback) has the following shape:

```json
{
  "to": "<ExpoPushToken>",
  "title": "<Sender Name>",
  "body": "<Message content>",
  "sound": "default",
  "data": {
    "url": "sopsc://chat/<conversationId>",
    "conversationId": "<conversationId>"
  }
}
```

- `url` is a deep link understood by the mobile app and opens the specified conversation.
- `conversationId` uniquely identifies the chat thread.

Any fallback transports such as FCM or APNs must include the same `data` object to ensure consistent behaviour across platforms.
