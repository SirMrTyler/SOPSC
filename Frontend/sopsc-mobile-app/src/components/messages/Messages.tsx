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
import ConversationItem from './ConversationItem';
import { useAuth } from '../../hooks/useAuth';
import { listenToMyConversations, FsConversation } from '../../services/fsMessages';
import ScreenContainer from '../navigation/ScreenContainer';

const PREVIEW_LENGTH = 50;

const Messages: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<FsConversation[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<FsConversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [queryString, setQuery] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        if (!user) return;
        const unsubscribe = listenToMyConversations(user.userId, list => {
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
        });
        return () => unsubscribe();
    }, [user]);

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
        <ScreenContainer>
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
