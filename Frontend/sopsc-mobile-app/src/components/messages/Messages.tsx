import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { getAll } from '../../services/messageService.js';
import ConversationItem from './ConversationItem';
import { MessageConversation } from '../../types/messages';

const Messages: React.FC = () => {
    const [messages, setMessages] = useState<MessageConversation[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
            {messages.length === 0 ? (
                <Text>No messages found.</Text>
            ) : (
                <FlatList
                data={messages}
                keyExtractor={(item, index) => item.messageId?.toString() ?? index.toString()}
                renderItem={({ item }) => (
                    <ConversationItem
                    conversation={item}
                    onPress={() => 
                        navigation.navigate('Conversation', { conversation: item })}
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
    header: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 8,
    },
});

export default Messages;