import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UsersIcon, PencilSquareIcon } from 'react-native-heroicons/outline';
import type { RootStackParamList } from '../../../App';
import { getAll } from '../../services/messageService.js';
import { search } from '../../services/userService.js';
import { useAuth } from '../../hooks/useAuth';
import ConversationItem from './ConversationItem';
import { MessageConversation } from '../../types/messages';
import { UserResult } from '../../types/user';

const Messages: React.FC = () => {
    const [messages, setMessages] = useState<MessageConversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserResult[]>([]);
    const [searching, setSearching] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user } = useAuth();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAll();
                if (Array.isArray(data?.items)) {
                    setMessages(data.items);
                } else if (Array.isArray(data)) {
                    setMessages(data);
                }
            } catch (err) {
                console.error('[Messages] Error fetching messages:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        setSearching(true);
        try {
            const data = await search(query.trim(), 0, 20);
            const fetched = data?.item?.pagedItems || [];
            const filtered = user ? fetched.filter(u => u.userId !== user.userId) : fetched;
            setResults(filtered);
        } catch (err) {
            console.error('[Messages] Search error:', err);
        } finally {
            setSearching(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleUserSelect = (user: UserResult) => {
        setQuery('');
        setResults([]);
        navigation.navigate('Conversation', {
            conversation: {
                messageId: 0,
                otherUserId: user.userId,
                otherUserName: `${user.firstName} ${user.lastName}`,
                otherUserProfilePicturePath: '',
                mostRecentMessage: '',
                isRead: true,
                sentTimestamp: '',
                numMessages: 0,
                isLastMessageFromUser: false,
            },
        });
    };

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
                    {/* Group chat icon, navigates to CreateGroupChat for creating new group chats */}
                    <TouchableOpacity 
                        style={styles.iconButton} 
                        onPress={() => navigation.navigate('CreateGroupChat')}
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
                    placeholder='Search users...'
                    placeholderTextColor={'#DED3C4'}
                    value={query}
                    onChangeText={setQuery}
                />
            </View>
            {results.length > 0 && (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.userId.toString()}
                    renderItem={({ item }) => (
                        <ConversationItem
                            conversation={{
                                messageId: 0,
                                otherUserId: item.userId,
                                otherUserName: `${item.firstName} ${item.lastName}`,
                                otherUserProfilePicturePath: item.profilePicturePath,
                                mostRecentMessage: '',
                                isRead: true,
                                sentTimestamp: '',
                                numMessages: 0,
                                isLastMessageFromUser: false,
                            }}
                            onPress={() => handleUserSelect(item)}
                        />
                    )}
                />
            )}
            {messages.length === 0 ? (
                <Text>No messages found.</Text>
            ) : (
                <FlatList
                    data={messages}
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