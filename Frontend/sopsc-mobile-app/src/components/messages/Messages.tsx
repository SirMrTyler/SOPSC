import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { getAll } from '../../services/messageService.js';

const Messages: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
      {messages.length === 0 ? (
        <Text>No messages found.</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
          renderItem={({ item }) => (
            <Text>{item.subject || item.text || JSON.stringify(item)}</Text>
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
});

export default Messages;