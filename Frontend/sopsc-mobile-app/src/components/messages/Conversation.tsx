// Library imports
import React, {useEffect, useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
// Components
import { Message } from '../../types/messages';
// Services
import { getConversation, send, deleteMessages, updateReadStatus } from '../../services/messageService.js';
// Hooks and Utils
import { formatTimestamp } from '../../utils/date';
import { useAuth } from '../../hooks/useAuth';
import { SocketContext } from '../../hooks/SocketContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;

const Conversation: React.FC<Props> = ({ route }) => {
    const { conversation } = route.params;
    const { user } = useAuth();
    const socket = useContext(SocketContext);

    const [messages, setMessages] = useState<Message[]>([]);
    const flatListRef = useRef<FlatList<Message>>(null);
    const [loading, setLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 20;
    const [totalCount, setTotalCount] = useState(0);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    
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
        if (err?.response?.status === 404) {
            setMessages([]);
            setTotalCount(0);
        } else {
            console.error('[Conversation] Error fetching messages:', err);
        }
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (!socket) return;
        const handler = async (msg: Message) => {
            if (msg.senderId === conversation.otherUserId) {
              setMessages(prev => [...prev, {...msg, isRead: true}]);
              flatListRef.current?.scrollToEnd({ animated: true });
              try {
                await updateReadStatus(msg.messageId, true);
              } catch (err) {
                console.error('[Conversation] Error updating read status:', err);
              }
            }
        };
        socket.on('newDirectMessage', handler);
        return () => {
            socket.off('newDirectMessage', handler);
        };
    }, [socket]);

    useEffect(() => {
      if (!loading && messages.length > 0) {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    }, [messages]);
    
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
                onPress: async () => {
                    try {
                        await deleteMessages(selectedIds);
                        setMessages(prev => prev.filter(m => !selectedIds.includes(m.messageId)));
                        setSelectedIds([]);
                    } catch (err) {
                        console.error('[Conversation] Error deleting messages:', err);
                    }
                },
            },
        ]);
    };

    const cancelSelection = () => setSelectedIds([]);

    const renderItem = ({ item }: { item: Message }) => {
        const incoming = item.senderId === conversation.otherUserId;
        const selected = selectedIds.includes(item.messageId);
        return (
            <TouchableOpacity
              activeOpacity={0.8}
              onLongPress={() => toggleSelect(item.messageId)}
            >
              <View style={[
                  incoming ? styles.messageLeft : styles.messageRight,
                  selected && styles.selected
                ]}>
                <Text>{item.messageContent}</Text>
                <View style={styles.meta}>
                    <Text style={styles.time}>{formatTimestamp(item.sentTimestamp)}</Text>
                    {!incoming && (
                        <Text style={styles.status}>{item.isRead ? ' Read' : ' Unread'}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
        );
    };

    const handleSend = async () => {
        if (!newMessage.trim() || sending || !user) return;
        setSending(true);
        try {
            const result = await send(conversation.otherUserId, newMessage.trim());
            
            const senderName =
              'firstName' in user && 'lastName' in user
                ? `${(user as any).firstName} ${(user as any).lastName}`
                : user?.email || '';
            console.log('[Conversation] Sender Name:', senderName);
            
            const message: Message = {
                messageId: result?.item || Date.now(),
                senderId: user.userId,
                senderName: senderName,
                recipientId: conversation.otherUserId,
                recipientName: conversation.otherUserName,
                messageContent: newMessage.trim(),
                sentTimestamp: new Date().toISOString(),
                readTimestamp: null,
                isRead: false,
            };
            setMessages(prev => [...prev, message]);
            socket?.emit('sendDirectMessage', message);
            flatListRef.current?.scrollToEnd({ animated: true });
            setNewMessage('');
        } catch (err) {
            console.error('[Conversation] Error sending message:', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <View style={styles.container}>
          {selectedIds.length > 0 && (
                <View style={styles.selectionBar}>
                    <Text style={styles.selectionText}>{selectedIds.length} selected</Text>
                    <Button title="Delete" onPress={deleteSelected} />
                    <Button title="Cancel" onPress={cancelSelection} />
                </View>
            )}
            <Text style={styles.header}>Conversation with {conversation.otherUserName}</Text>
            {loading && messages.length === 0 ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.messageId.toString()}
                onEndReached={handleEndReached}
                />
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    placeholderTextColor={'#999'}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    editable={!sending}
                />
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
    color: 'white'
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
  selected: {
    opacity: 0.6,
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

export default Conversation;