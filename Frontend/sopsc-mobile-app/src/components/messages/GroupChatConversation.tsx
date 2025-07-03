import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { getMessages, sendMessage } from '../../services/groupChatService';
import { GroupChatMessage } from '../../types/groupChat';
import { formatTimestamp } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupChatConversation'>;

const GroupChatConversation: React.FC<Props> = ({ route }) => {
  const { chatId, name } = route.params;
  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const load = async (nextPage = 0) => {
    try {
      const data = await getMessages(chatId, nextPage, pageSize);
      const paged = data?.item;
      if (paged) {
        setTotalCount(paged.totalCount);
        setMessages(prev => nextPage === 0 ? paged.pagedItems : [...prev, ...paged.pagedItems]);
        setPageIndex(nextPage);
      }
    } catch (err) {
      console.error('[GroupChatConversation] Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleEndReached = () => {
    if (!loading && messages.length < totalCount) {
      load(pageIndex + 1);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(chatId, newMessage.trim());
      setNewMessage('');
      load();
    } catch (err) {
      console.error('[GroupChatConversation] Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: GroupChatMessage }) => (
    <View style={styles.msgBox}>
      <Text style={styles.msgAuthor}>{item.senderName}</Text>
      <Text>{item.messageContent}</Text>
      <Text style={styles.time}>{formatTimestamp(item.sentTimestamp)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{name}</Text>
      {loading && messages.length === 0 ? (
        <ActivityIndicator />
      ) : (
        <FlatList data={messages} renderItem={renderItem} keyExtractor={item => item.messageId.toString()} onEndReached={handleEndReached} />
      )}
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Type a message" placeholderTextColor="#999" value={newMessage} onChangeText={setNewMessage} editable={!sending} />
        <Button title="Send" onPress={handleSend} disabled={sending || !newMessage.trim()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
  },
  msgBox: {
    backgroundColor: '#eee',
    marginVertical: 4,
    padding: 8,
    borderRadius: 4,
  },
  msgAuthor: {
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#666',
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

export default GroupChatConversation;