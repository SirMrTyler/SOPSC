import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { Message } from '../../types/messages';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '../../hooks/useAuth';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, collection, addDoc, doc, updateDoc, serverTimestamp } from '@react-native-firebase/firestore';
import ScreenContainer from '../navigation/ScreenContainer';
import { formatTimestamp } from '../../utils/date';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Conversation'> {}

const db = getFirestore(getApp());

const Conversation: React.FC<Props> = ({ route }) => {
  const { conversation } = route.params;
  const { user } = useAuth();
  const messages = useMessages<Message>(`conversations/${conversation.chatId}/messages`);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (!user) return;
    const markRead = async () => {
      await updateDoc(doc(db, 'conversations', conversation.chatId), {
        [`readBy.${user.userId}`]: true,
        isRead: true,
      });
      messages.forEach(msg => {
        if (!msg.readBy || !msg.readBy[user.userId]) {
          updateDoc(doc(db, `conversations/${conversation.chatId}/messages`, msg.messageId), {
            [`readBy.${user.userId}`]: true,
            isRead: true,
          });
        }
      });
    };
    markRead();
  }, [messages, user, conversation.chatId]);

  const handleSend = async () => {
    if (!user || !newMessage.trim()) return;
    const content = newMessage.trim();
    const msgRef = await addDoc(collection(db, `conversations/${conversation.chatId}/messages`), {
      senderId: user.userId,
      senderName: `${user.firstName} ${user.lastName}`,
      messageContent: content,
      sentTimestamp: serverTimestamp(),
      readBy: { [user.userId]: true },
    });
    await updateDoc(doc(db, 'conversations', conversation.chatId), {
      mostRecentMessage: content,
      lastMessageId: msgRef.id,
      sentTimestamp: serverTimestamp(),
      isLastMessageFromUser: true,
      isRead: false,
    });
    setNewMessage('');
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderItem = ({ item }: { item: Message }) => {
    const incoming = item.senderId === conversation.otherUserId;
    const sentDate =
      typeof item.sentTimestamp === 'string'
        ? new Date(item.sentTimestamp)
        : item.sentTimestamp.toDate();
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
            <Text style={styles.time}>{formatTimestamp(sentDate)}</Text>
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
