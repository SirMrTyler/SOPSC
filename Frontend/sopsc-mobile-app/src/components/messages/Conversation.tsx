// Library imports
import React, {useEffect, useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
// Components
import { Message, MessageCreated } from '../../types/messages';
// Services
import { getConversation, send, deleteMessages, updateReadStatus } from '../../services/messageService.js';
// Hooks and Utils
import { formatTimestamp } from '../../utils/date';
import { useAuth } from '../../hooks/useAuth';
import { SocketContext } from '../../hooks/SocketContext';
import ScreenContainer from '../navigation/ScreenContainer';

type Props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;

const Conversation: React.FC<Props> = ({ route }) => {
    const { conversation } = route.params;
    const { user } = useAuth();
    const socket = useContext(SocketContext);
    const listRef = useRef<FlatList<Message>>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 20;
    const [totalCount, setTotalCount] = useState(0);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [initialLoad, setInitialLoad] = useState(true);

    const uniqueById = (list: Message[]) => {
      const seen = new Set<number>();
      return list.filter(m => {
        if (seen.has(m.messageId)) return false;
        seen.add(m.messageId);
        return true;
      });
    };

    const markAllRead = async (list: Message[]) => {
      const unread = list.filter(m => !m.isRead && m.senderId === conversation.otherUserId);
      if (unread.length === 0) return;
      for (const m of unread) {
        try {
          await updateReadStatus(m.messageId, true);
          socket?.emit('directMessageRead', {
            messageId: m.messageId,
            senderId: m.senderId,
            readerId: user?.userId,
          });
        } catch (err) {
            console.error('[Conversation] Error updating read status:', err);
        }
      }
      setMessages(prev => prev.map(m => unread.some(u => u.messageId === m.messageId) ? { ...m, isRead: true } : m));
    };

    const load = async (nextPage = 0) => {
        try {
        const data = await getConversation(conversation.chatId, nextPage, pageSize);
        const paged = data?.item;
        if (paged) {
          let items: Message[] = await Promise.all(
            paged.pagedItems.map(async m => {
              if (!m.isRead && m.senderId === conversation.otherUserId) {
                try {
                  await updateReadStatus(m.messageId, true);
                  socket?.emit('directMessageRead', {
                    messageId: m.messageId,
                    senderId: m.senderId,
                    readerId: user?.userId,
                  });
                } catch (err) {
                    console.error('[Conversation] Error updating read status:', err);
                }
                return { ...m, isRead: true };
              }
              return m;
            })
          );
            items = items.reverse();
            setTotalCount(paged.totalCount);
            setMessages(prev => {
              const combined = nextPage === 0 ? items : [...items, ...prev];
              return uniqueById(combined);
            });
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
      if (initialLoad && !loading && messages.length > 0) {
        listRef.current?.scrollToEnd({ animated: false });
        setInitialLoad(false);
      }
    }, [initialLoad, loading, messages]);
    useFocusEffect(
      React.useCallback(() => {
        if (messages.length > 0) {
            markAllRead(messages);
        }
      }, [messages])
    );

    useEffect(() => {
      if (!socket) return;
      const handler = async (msg: Message) => {
        if (msg.chatId === conversation.chatId && msg.senderId === conversation.otherUserId) {
          setMessages(prev => uniqueById([...prev, { ...msg, isRead: true }]));
          listRef.current?.scrollToEnd({ animated: true });
          try {
            await updateReadStatus(msg.messageId, true);
            socket?.emit('directMessageRead', {
              messageId: msg.messageId,
              senderId: msg.senderId,
              readerId: user?.userId,
            });
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
        if (!socket) return;
        const handler = (payload: { messageId: number; senderId: number; readerId: number }) => {
            if (payload.senderId === user?.userId) {
                setMessages(prev => prev.map(m =>
                    m.messageId === payload.messageId ? { ...m, isRead: true } : m
                ));
            }
        };
        socket.on('directMessageRead', handler);
        return () => {
            socket.off('directMessageRead', handler);
        };
    }, [socket, user, conversation.otherUserId]);
    
    const handleScroll = (event: any) => {
        if (event.nativeEvent.contentOffset.y <= 0 && !loading && messages.length < totalCount) {
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
            const result: { item?: MessageCreated } = await send(conversation.chatId, newMessage.trim());
            
            const senderName =
              user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.email || '';
            if (__DEV__) {
                console.log('[Conversation] Sender Name:', senderName);
            }
            
            const messageId = result?.item?.id || Date.now();
            const chatId = result?.item?.chatId ?? conversation.chatId;

            const message: Message = {
                messageId: messageId,
                chatId: chatId,
                senderId: user.userId,
                senderName: senderName,
                messageContent: newMessage.trim(),
                sentTimestamp: new Date().toISOString(),
                readTimestamp: null,
                isRead: false,
            };
            setMessages(prev => uniqueById([...prev, message]));
            listRef.current?.scrollToEnd({ animated: true });
            socket?.emit('sendDirectMessage', message);
            setNewMessage('');
        } catch (err) {
            console.error('[Conversation] Error sending message:', err);
        } finally {
            setSending(false);
        }
    };

    return (
      <ScreenContainer showBottomBar={false} showBack title={conversation.otherUserName}>
        <View style={styles.container}>
          {selectedIds.length > 0 && (
              <View style={styles.selectionBar}>
                <Text style={styles.selectionText}>{selectedIds.length} selected</Text>
                <Button title="Delete" onPress={deleteSelected} />
                <Button title="Cancel" onPress={cancelSelection} />
              </View>
          )}
          {/* title handled by top bar */}
          {loading && messages.length === 0 ? (
              <ActivityIndicator />
          ) : (
              <FlatList
              ref={listRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item) => item.messageId.toString()}
              onScroll={handleScroll}
              scrollEventThrottle={16}
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
      </ScreenContainer>
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