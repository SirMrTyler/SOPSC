/**
 * File: Inbox.tsx
 * Purpose: Shows the user's recent conversations with search and navigation shortcuts.
 * Notes: Subscribes to conversation updates and truncates message previews.
 */
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UsersIcon, PencilSquareIcon } from 'react-native-heroicons/outline';
import type { RootStackParamList } from '../../../App';
import RenderMessageItem from './Messages/RenderMessageItem';
import { useAuth } from '../../hooks/useAuth';
import { listenToMyConversations, FsConversation } from '../../types/fsMessages';
import ScreenContainer from '../Navigation/ScreenContainer';

const PREVIEW_LENGTH = 50;

/**
 * Messages
 * Displays all user conversations and provides search and creation entry points.
 */
const Messages: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<FsConversation[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<FsConversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [queryString, setQuery] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // Subscribe to Firestore for real-time conversation updates
    useEffect(() => {
        if (!user) return;
        const unsubscribe = listenToMyConversations(
            { userId: user.userId, firebaseUid: user.firebaseUid },
            list => {
            const trimmed = list.map(c => ({
                ...c,
                mostRecentMessage:
                    c.mostRecentMessage.length > PREVIEW_LENGTH
                        ? c.mostRecentMessage.slice(0, PREVIEW_LENGTH) + '...'
                        : c.mostRecentMessage,
            }));
            setMessages(trimmed);
            setFilteredMessages(trimmed);
            setLoading(false);
        }
        );
        return () => unsubscribe();
    }, [user]);

    // Refilter messages when search input changes
    useEffect(() => {
        const q = queryString.trim().toLowerCase();
        if (!q) {
            setFilteredMessages(messages);
        } else {
            setFilteredMessages(
                messages.filter(m => m.mostRecentMessage.toLowerCase().includes(q))
            );
        }
    }, [queryString, messages]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator/>
            </View>
        );
    }

    return (
        <ScreenContainer showBack title="Home">
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={styles.header}>Messages</Text>
                    <View style={styles.iconRow}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => navigation.navigate('GroupChats')}
                        >
                            <UsersIcon size={28} color="white" />
                        </TouchableOpacity>
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
                        value={queryString}
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
                        keyExtractor={(item) => item.chatId.toString()}
                        renderItem={({ item }) => (
                            <RenderMessageItem
                                conversation={item}
                                onPress={() =>
                                    navigation.navigate('Conversation', { conversation: item })
                                }
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
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconRow: {
        flexDirection: 'row',
        gap: 10,
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
