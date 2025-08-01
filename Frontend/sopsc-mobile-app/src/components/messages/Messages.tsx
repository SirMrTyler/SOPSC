import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UsersIcon, PencilSquareIcon } from 'react-native-heroicons/outline';
import type { RootStackParamList } from '../../../App';
import { getAll, deleteConversation } from '../../services/messageService.js';
import ConversationItem from './ConversationItem';
import { MessageConversation, Message } from '../../types/messages';
import { useAuth } from '../../hooks/useAuth';
import { SocketContext } from '../../hooks/SocketContext';
import ScreenContainer from '../navigation/ScreenContainer';

const PREVIEW_LENGTH = 50; // Characters to show in preview

const Messages: React.FC = () => {
    const { user } = useAuth();
    const socket = useContext(SocketContext);
    const [messages, setMessages] = useState<MessageConversation[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<MessageConversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const uniqueById = (list: MessageConversation[]) => {
        const seen = new Set<number>();
        return list.filter(item => {
            if (seen.has(item.messageId)) return false;
            seen.add(item.messageId);
            return true;
        });
    };

    const handleDeleteConversation = (otherUserId: number) => {
        Alert.alert('Delete Conversation', 'Are you sure you want to delete this conversation?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteConversation(otherUserId);
                        setMessages(prev => prev.filter(c => c.otherUserId !== otherUserId));
                        setFilteredMessages(prev => prev.filter(c => c.otherUserId !== otherUserId));
                    } catch (err) {
                        console.error('[Messages] Error deleting conversation:', err);
                    }
                },
            },
        ]);
    };

    const load = async () => {
        try {
            const data = await getAll();
            let list: MessageConversation[] = [];
            if (Array.isArray(data?.items)) {
                list = data.items as MessageConversation[];
            } else if (Array.isArray(data)) {
                list = data as MessageConversation[];
            }
            list = list.map(item => ({
                ...item,
                mostRecentMessage:
                    item.mostRecentMessage.length > PREVIEW_LENGTH
                        ? item.mostRecentMessage.slice(0, PREVIEW_LENGTH) + '...'
                        : item.mostRecentMessage,
            }));
            list = uniqueById(list);
            setMessages(list);
            setFilteredMessages(list);
        } catch (err) {
            console.error('[Messages] Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            load();
        }, [])
    );

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (!socket) return;
        const handler = (_msg: Message) => load();
        socket.on('newDirectMessage', handler);
        return () => {
            socket.off('newDirectMessage', handler);
        };
    }, [socket]);
        
    useEffect(() => {
        if (!socket) return;
        const handler = (payload: { messageId: number; senderId: number; readerId: number }) => {
            if (payload.senderId === user?.userId) {
                setMessages(prev => {
                    const updated = prev.map(c =>
                        c.otherUserId === payload.readerId
                            ? { ...c, isRead: true, numMessages: Math.max(0, c.numMessages - 1) }
                            : c
                    );
                    setFilteredMessages(updated);
                    return updated;
                });
            }
        };
        socket.on('directMessageRead', handler);
        return () => {
            socket.off('directMessageRead', handler);
        };
    }, [socket, user]);
    
    useEffect(() => {
        const q = query.trim().toLowerCase();
        if(!q) {
            setFilteredMessages(messages);
        } else {
            setFilteredMessages(
                messages.filter(m => m.mostRecentMessage.toLowerCase().includes(q))
            );
        }
    }, [query, messages]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator/>
            </View>
        );
    }

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.headerRow}>

                    {/* Title | Header for messages */}
                    <Text style={styles.header}>Messages</Text>

                    {/* Row container for group chat and create conversation icons */}
                    <View style={styles.iconRow}>
                        {/* Group chat icon, opens list of group chats */}
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => navigation.navigate('GroupChats')}
                        >
                            <UsersIcon size={28} color="white" />
                        </TouchableOpacity>

                        {/* Create conversation icon, navigates to UserList for finding and selecting users */}
                        <TouchableOpacity 
                            style={styles.iconButton} 
                            onPress={() => navigation.navigate('UserList')}
                        >
                            <PencilSquareIcon size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                    
                </View>
                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Search messages...'
                        placeholderTextColor={'#DED3C4'}
                        value={query}
                        onChangeText={setQuery}
                    />
                </View>
                {filteredMessages.length === 0 ? (
                    <View style={styles.container}>
                        <Text style={{ color: 'white' }}>No messages found.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredMessages}
                        keyExtractor={(item, index) =>
                            item.messageId?.toString() ?? index.toString()
                        }
                        renderItem={({ item }) => (
                            <ConversationItem
                                conversation={item}
                                onPress={() =>
                                    navigation.navigate('Conversation', { conversation: item })
                                }
                                onLongPress={() => handleDeleteConversation(item.otherUserId)}
                            />
                        )}
                    />
                )}
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconRow: {
        flexDirection: 'row',
        gap: 10, // Optional, or use marginRight in iconButton
    },

    iconButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 10,
        padding: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.07)',
    },
    searchRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    searchInput: {
        flex: 1,
        borderColor: 'white',
        borderWidth: 1,
        marginRight: 8,
        paddingHorizontal: 8,
        borderRadius: 4,
        color: 'white',
    },
    header: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 8,
        color: 'white',
    },
});

export default Messages;