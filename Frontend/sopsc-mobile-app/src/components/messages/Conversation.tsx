import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '../../hooks/useAuth';
import ScreenContainer from '../navigation/ScreenContainer';
import { FsMessage, sendMessage, markConversationRead } from '../../types/fsMessages';
import { formatTimestamp } from '../../utils/date';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Conversation'> {}

const Conversation: React.FC<Props> = ({ route }) => {
  const { conversation } = route.params;
  const { user } = useAuth();
  const messages = useMessages<FsMessage>(`conversations/${conversation.chatId}/messages`);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList<FsMessage>>(null);

  useEffect(() => {
    if (!user) return;
    markConversationRead(conversation.chatId, user.userId, messages);
  }, [messages, user, conversation.chatId]);

  const handleSend = async () => {
    if (!user || !newMessage.trim()) return;
    const content = newMessage.trim();
    await sendMessage(conversation.chatId, {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
    }, content);
    setNewMessage('');
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderItem = ({ item }: { item: FsMessage }) => {
    const incoming = item.senderId === conversation.otherUserId;
    const isRead = item.readBy
      ? incoming
        ? !!item.readBy[String(user?.userId ?? '')]
        : !!item.readBy[String(conversation.otherUserId)]
      : item.isRead;
    return (
      <View style={incoming ? styles.messageRowLeft : styles.messageRowRight}>
        {incoming && (
          <Image
            source={{ uri: conversation.otherUserProfilePicturePath }}
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
    <ScreenContainer showBottomBar={false} showBack title={conversation.otherUserName}>
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
