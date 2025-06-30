import React, {useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { MessageConversation, Message } from '../../types/messages';
import { getConversation } from '../../services/messageService.js';
import { formatTimestamp } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;

const Conversation: React.FC<Props> = ({ route }) => {
  const { conversation } = route.params;
const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);

  const load = async (nextPage = 0) => {
    try {
      const data = await getConversation(conversation.otherUserId, nextPage, pageSize);
      const paged = data?.item;
      if (paged) {
        setTotalCount(paged.totalCount);
        setMessages(prev => nextPage === 0 ? paged.pagedItems : [...prev, ...paged.pagedItems]);
        setPageIndex(nextPage);
      }
    } catch (err) {
      console.error('[Conversation] Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEndReached = () => {
    if (!loading && messages.length < totalCount) {
      load(pageIndex + 1);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const incoming = item.senderId === conversation.otherUserId;
    return (
      <View style={incoming ? styles.messageLeft : styles.messageRight}>
        <Text>{item.messageContent}</Text>
        <View style={styles.meta}>
          <Text style={styles.time}>{formatTimestamp(item.sentTimestamp)}</Text>
          {!incoming && (
            <Text style={styles.status}>{item.isRead ? 'Read' : 'Unread'}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Conversation with {conversation.otherUserName}</Text>
      {loading && messages.length === 0 ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.messageId.toString()}
          onEndReached={handleEndReached}
        />
      )}
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
  },
  messageLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    marginVertical: 4,
    padding: 8,
    borderRadius: 4,
  },
  messageRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#cfe9ff',
    marginVertical: 4,
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
  status: {
    fontSize: 12,
    color: '#666',
  },
});

export default Conversation;