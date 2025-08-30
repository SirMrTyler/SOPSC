/**
 * File: RenderGroupMessage.tsx
 * Purpose: Renders a group chat conversation and provides input to send messages.
 * Notes: Subscribes to Firestore collection for real-time updates.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../../App';
import { useAuth } from '../../../hooks/useAuth';
import ScreenContainer from '../../Navigation/ScreenContainer';
import { formatTimestamp } from '../../../utils/date';
import {
  FsMessage,
  FsConversation,
  listenToConversationMessages,
  getFsConversation,
} from '../../../types/fsMessages';
import { sendMessage } from '../services/groupChatFs';
import { UserPlusIcon } from 'react-native-heroicons/outline';

interface Props extends NativeStackScreenProps<RootStackParamList, 'GroupChatConversation'> {}

/**
 * GroupChatConversation
 * Displays messages for the specified group chat and handles sending new messages.
 */
const GroupChatConversation: React.FC<Props> = ({ route, navigation }) => {
  const { chatId, name } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<FsMessage[]>([]);
  const [conversation, setConversation] = useState<FsConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList<FsMessage>>(null);

  useEffect(() => {
    getFsConversation(chatId, user?.userId ?? 0).then(setConversation);
    const unsub = listenToConversationMessages(chatId, setMessages);
    return () => unsub();
  }, [chatId, user?.userId]);

  /**
   * Persists a new message document and scrolls the list to the latest entry.
   */
  const handleSend = async () => {
    if (!user || !newMessage.trim() || !conversation) return;
    const recipients = Object.entries(conversation.participants || {})
      .filter(([_, info]) => info.userId !== user.userId)
      .map(([firebaseUid, info]) => ({ firebaseUid, userId: info.userId }));
    await sendMessage(
      chatId,
      {
        userId: user.userId,
        firebaseUid: user.firebaseUid,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicturePath: user.profilePicturePath,
      },
      newMessage.trim(),
      recipients,
    );
    setNewMessage('');
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  /**
   * Renders a message bubble with timestamp and sender name.
   */
  const renderItem = ({ item }: { item: FsMessage }) => {
    const outgoing = item.senderId === user?.userId;
    return (
      <View style={[styles.msgBox, outgoing ? styles.msgRight : styles.msgLeft]}>
        <Text style={styles.msgAuthor}>{item.senderName}</Text>
        <Text>{item.messageContent}</Text>
        <View style={styles.meta}>
          <Text style={styles.time}>{formatTimestamp(item.sentTimestamp)}</Text>
        </View>
      </View>
    );
  };

  const memberNames = conversation
    ? Object.values(conversation.memberProfiles)
        .map((m) => `${m.firstName} ${m.lastName}`.trim())
        .join(', ')
    : '';

  return (
    <ScreenContainer
      showBottomBar={false}
      showBack
      title={name}
      rightComponent={
        <TouchableOpacity
          onPress={() => navigation.navigate('AddGroupChatMembers', { chatId })}
        >
          <UserPlusIcon color="white" size={22} />
        </TouchableOpacity>
      }
    >
      <View style={styles.container}>
        {conversation && (
          <Text style={styles.membersText}>
            <Text style={styles.membersLabel}>Members: </Text>
            {memberNames}
          </Text>
        )}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.messageId}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            placeholderTextColor="#999"
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
  msgBox: { marginVertical: 4, padding: 8, borderRadius: 4 },
  msgLeft: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
  },
  msgRight: { alignSelf: 'flex-end', backgroundColor: '#cfe9ff' },
  msgAuthor: { fontWeight: 'bold' },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  time: { fontSize: 12, color: '#666' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  membersText: { marginBottom: 8 },
  membersLabel: { fontWeight: 'bold' },
});

export default GroupChatConversation;
