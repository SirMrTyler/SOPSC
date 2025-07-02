import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
            <Text style={styles.header}>Messages</Text>
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