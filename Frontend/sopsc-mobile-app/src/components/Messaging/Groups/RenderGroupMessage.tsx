/**
 * File: RenderGroupMessage.tsx
 * Purpose: Renders a group chat conversation and provides input to send messages.
 * Notes: Subscribes to Firestore collection for real-time updates.
 */
import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../../App';
import { GroupChatMessage } from '../../../types/groupChat';
import { useMessages } from '../../../hooks/useMessages';
import { useAuth } from '../../../hooks/useAuth';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from '@react-native-firebase/firestore';
import ScreenContainer from '../../Navigation/ScreenContainer';
import { formatTimestamp } from '../../../utils/date';

interface Props extends NativeStackScreenProps<RootStackParamList, 'GroupChatConversation'> {}

const db = getFirestore(getApp());

/**
 * GroupChatConversation
 * Displays messages for the specified group chat and handles sending new messages.
 */
const GroupChatConversation: React.FC<Props> = ({ route }) => {
  const { chatId, name } = route.params;
  const { user } = useAuth();
  const messages = useMessages<GroupChatMessage>(`groupChats/${chatId}/messages`);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList<GroupChatMessage>>(null);

  /**
   * Persists a new message document and scrolls the list to the latest entry.
   */
  const handleSend = async () => {
    if (!user || !newMessage.trim()) return;
    await addDoc(collection(db, `groupChats/${chatId}/messages`), {
      groupChatId: chatId,
      senderId: user.userId,
      senderName: `${user.firstName} ${user.lastName}`,
      messageContent: newMessage.trim(),
      sentTimestamp: serverTimestamp(),
      readBy: { [user.userId]: true },
    });
    setNewMessage('');
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  /**
   * Renders a message bubble with timestamp and sender name.
   */
  const renderItem = ({ item }: { item: GroupChatMessage }) => {
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

  return (
    <ScreenContainer showBottomBar={false} showBack title={name}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.messageId.toString()}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
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
});

export default GroupChatConversation;
