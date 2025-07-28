import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { getMessages, sendMessage, getMembers } from '../../services/groupChatService';
import { UserPlusIcon } from 'react-native-heroicons/outline';
import { GroupChatMessage, GroupChatMember } from '../../types/groupChat';
import { formatTimestamp } from '../../utils/date';
import { useAuth } from '../../hooks/useAuth';
import { SocketContext } from '../../hooks/SocketContext';
import ScreenContainer from '../navigation/ScreenContainer';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupChatConversation'>;

const GroupChatConversation: React.FC<Props> = ({ route, navigation }) => {
  const { chatId, name } = route.params;
  const { user } = useAuth();
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [members, setMembers] = useState<GroupChatMember[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
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
    if (!socket) return;
    socket.emit('joinGroup', { groupChatId: chatId });
    const handler = (msg: GroupChatMessage) => {
      if (msg.groupChatId === chatId) {
        setMessages(prev => [...prev, msg]);
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    };
    socket.on('newGroupMessage', handler);
    return () => {
      socket.off('newGroupMessage', handler);
    };
  }, [socket, chatId]);

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

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    Alert.alert('Delete Messages', 'Delete selected messages?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setMessages(prev => prev.filter(m => !selectedIds.includes(m.messageId)));
          setSelectedIds([]);
        },
      },
    ]);
  };

  const cancelSelection = () => setSelectedIds([]);

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
      socket?.emit('sendGroupMessage', message);
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
    const selected = selectedIds.includes(item.messageId);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => toggleSelect(item.messageId)}
      >
        <View
          style={[
            styles.msgBox,
            outgoing ? styles.msgRight : styles.msgLeft,
            selected && styles.selected,
          ]}
        >
          <Text style={styles.msgAuthor}>{item.senderName}</Text>
          <Text>{item.messageContent}</Text>
          <View style={styles.meta}>
            <Text style={styles.time}>{formatTimestamp(item.sentTimestamp)}</Text>
            {outgoing && (
              <Text style={styles.status}>{item.isRead ? ' Read' : ' Unread'}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer showBottomBar={false} showBack title={name}>
      <View style={styles.container}>
        {selectedIds.length > 0 && (
          <View style={styles.selectionBar}>
            <Text style={styles.selectionText}>{selectedIds.length} selected</Text>
            <Button title="Delete" onPress={deleteSelected} />
            <Button title="Cancel" onPress={cancelSelection} />
          </View>
        )}
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
    </ScreenContainer>
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
  selected: {
    opacity: 0.6,
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
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectionText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GroupChatConversation;