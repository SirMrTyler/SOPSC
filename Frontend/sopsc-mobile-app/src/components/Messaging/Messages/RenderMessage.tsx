/**
 * File: RenderMessage.tsx
 * Purpose: Displays a direct conversation thread and allows sending new messages.
 * Notes: Marks messages as read when viewed and scrolls to the latest on send.
 */
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../../App';
import { useMessages } from '../../../hooks/useMessages';
import { useAuth } from '../../../hooks/useAuth';
import ScreenContainer from '../../Navigation/ScreenContainer';
import { FsMessage, sendMessage, markConversationRead } from '../../../types/fsMessages';
import { formatTimestamp } from '../../../utils/date';
import { useConversationMeta } from '../../../hooks/useConversationMeta';
import defaultAvatar from '../../../../assets/images/default-avatar.png';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Conversation'> {}

/**
 * Conversation
 * Renders an individual chat and handles read receipts and message sending.
 */
const Conversation: React.FC<Props> = ({ route }) => {
  const { conversation } = route.params;
  const { user } = useAuth();
  const meta = useConversationMeta(conversation.chatId);
  const messages = useMessages<FsMessage>(`conversations/${conversation.chatId}/messages`);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList<FsMessage>>(null);

  // Mark messages as read whenever new ones arrive
  useEffect(() => {
    if (!user) return;
    markConversationRead(
      conversation.chatId,
      { userId: user.userId, firebaseUid: user.firebaseUid },
      messages
    );
  }, [messages, user, conversation.chatId]);

  /**
   * Sends a message through the Firestore helper and resets the input.
   */
  const handleSend = async () => {
    if (!user || !newMessage.trim()) return;
    const content = newMessage.trim();
    const participantEntries = Object.entries(conversation.participants || {});
    const recipients = participantEntries.map(([uid, { userId }]) => ({
      firebaseUid: uid,
      userId,
    }));
    await sendMessage(
      conversation.chatId,
      {
        userId: user.userId,
        firebaseUid: user.firebaseUid,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicturePath: user.profilePicturePath,
      },
      content,
      meta.type || conversation.type,
      recipients
    );
    setNewMessage('');
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  /**
   * Renders each message bubble with timestamp and read status.
   */
  const profiles = meta.memberProfiles || conversation.memberProfiles || {};
  const participantIds = Object.keys(profiles).map((id) => Number(id));
  const otherIds = participantIds.filter((id) => id !== user?.userId);
  const conversationName =
    (meta.type || conversation.type) === 'group'
      ? 'Group Chat'
      : `${profiles[String(otherIds[0])]?.firstName ?? ''} ${profiles[String(otherIds[0])]?.lastName ?? ''}`.trim();

  const renderItem = ({ item }: { item: FsMessage }) => {
    const incoming = item.senderId !== user?.userId;
    const participantUids = Object.keys(conversation.participants || {});
    const otherParticipantUids = participantUids.filter(
      (uid) => conversation.participants[uid].userId !== item.senderId
    );
    const isRead = incoming
      ? !!item.readBy?.[user?.firebaseUid || '']
      : otherParticipantUids.every((uid) => item.readBy?.[uid]);
    return (
      <View style={incoming ? styles.messageRowLeft : styles.messageRowRight}>
        {incoming && (
          <Image
            source={
              profiles[String(item.senderId)]?.profilePicturePath
                ? { uri: profiles[String(item.senderId)].profilePicturePath }
                : defaultAvatar
            }
            style={styles.avatar}
          />
        )}
        <View style={incoming ? styles.messageLeft : styles.messageRight}>
          <Text>{item.messageContent}</Text>
          <View style={styles.meta}>
            <Text style={styles.time}>{formatTimestamp(item.sentTimestamp)}</Text>
            <Text style={styles.readStatus}>{isRead ? 'Read' : 'Unread'}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer showBottomBar={false} showBack title={conversationName}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.messageId}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            placeholderTextColor={'#999'}
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <Button title="Send" onPress={handleSend} disabled={!newMessage.trim()} />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  messageRowLeft: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  messageRowRight: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginVertical: 4,
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageLeft: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 4,
  },
  messageRight: {
    backgroundColor: '#cfe9ff',
    padding: 8,
    borderRadius: 4,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  readStatus: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default Conversation;
