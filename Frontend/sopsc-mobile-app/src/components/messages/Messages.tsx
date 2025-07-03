import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UsersIcon, PencilSquareIcon } from 'react-native-heroicons/outline';
import type { RootStackParamList } from '../../../App';
import { getAll } from '../../services/messageService.js';
import ConversationItem from './ConversationItem';
import { MessageConversation } from '../../types/messages';

const Messages: React.FC = () => {
    const [messages, setMessages] = useState<MessageConversation[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<MessageConversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAll();
                if (Array.isArray(data?.items)) {
                    setMessages(data.items);
                    setFilteredMessages(data.items);
                } else if (Array.isArray(data)) {
                    setMessages(data);
                    setFilteredMessages(data);
                }
            } catch (err) {
                console.error('[Messages] Error fetching messages:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

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
                        />
                    )}
                />
            )}
        </View>
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