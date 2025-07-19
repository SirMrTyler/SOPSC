import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { getMessages, sendMessage, getMembers } from '../../services/groupChatService';
import { UserPlusIcon } from 'react-native-heroicons/outline';
import { GroupChatMessage, GroupChatMember } from '../../types/groupChat';
import { formatTimestamp } from '../../utils/date';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupChatConversation'>;

const GroupChatConversation: React.FC<Props> = ({ route, navigation }) => {
  const { chatId, name } = route.params;
  const { user } = useAuth();
  const socketRef = useSocket(user);
  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [members, setMembers] = useState<GroupChatMember[]>([]);
  const flatListRef = useRef<FlatList<GroupChatMessage>>(null);

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

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.emit('joinGroup', { groupChatId: chatId });
    const handler = (msg: GroupChatMessage) => {
      if (msg.groupChatId === chatId) {
        setMessages(prev => [...prev, msg]);
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    };
    socketRef.current.on('newGroupMessage', handler);
    return () => {
      socketRef.current?.off('newGroupMessage', handler);
    };
  }, [socketRef.current, chatId]);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers(chatId);
        const list = data?.items || [];
        setMembers(list as GroupChatMember[]);
      } catch (err) {
        console.error('[GroupChatConversation] Error fetching members:', err);
      }
    };
    fetchMembers();
  }, []);
  
  const handleEndReached = () => {
    if (!loading && messages.length < totalCount) {
      load(pageIndex + 1);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const result = await sendMessage(chatId, newMessage.trim());
      const message: GroupChatMessage = {
        messageId: result?.item || Date.now(),
        groupChatId: chatId,
        senderId: user?.userId || 0,
        senderName: user ? `${user.name.firstName} ${user.name.lastName}` : '',
        messageContent: newMessage.trim(),
        sentTimestamp: new Date().toISOString(),
        readTimestamp: null,
        isRead: false,
      };
      setMessages(prev => [...prev, message]);
      socketRef.current?.emit('sendGroupMessage', message);
      flatListRef.current?.scrollToEnd({ animated: true });
      setNewMessage('');
    } catch (err) {
      console.error('[GroupChatConversation] Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: GroupChatMessage }) => {
    const outgoing = user ? item.senderId === user.userId : false;
    return (
      <View style={[styles.msgBox, outgoing ? styles.msgRight : styles.msgLeft]}>
        <Text style={styles.msgAuthor}>{item.senderName}</Text>
        <Text>{item.messageContent}</Text>
        <View style={styles.meta}>
          <Text style={styles.time}>{formatTimestamp(item.sentTimestamp)}</Text>
          {outgoing && (
            <Text style={styles.status}>{item.isRead ? ' Read' : ' Unread'}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{name}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddGroupChatMembers', { chatId })}
        >
          <UserPlusIcon size={24} color="white" />
        </TouchableOpacity>
      </View>
      {members.length > 0 && (
        <View style={styles.memberBox}>
          <Text style={styles.memberText}>
            Members: {members.map(m => `${m.firstName} ${m.lastName}`).join(', ')}
          </Text>
        </View>
      )}
      {loading && messages.length === 0 ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.messageId.toString()}
          onEndReached={handleEndReached}
        />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
  },
   memberBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  memberText: {
    color: 'white',
    fontSize: 12,
  },
  msgBox: {
    backgroundColor: '#eee',
    marginVertical: 4,
    padding: 8,
    borderRadius: 4,
  },
  msgLeft: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
  },
  msgRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#cfe9ff',
  },
  msgAuthor: {
    fontWeight: 'bold',
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