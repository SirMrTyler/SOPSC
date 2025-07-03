import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
import { getAll } from '../../services/groupChatService';
import { GroupChatSummary } from '../../types/groupChat';

const GroupChats: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [chats, setChats] = useState<GroupChatSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAll();
        if (Array.isArray(data?.items)) {
          setChats(data.items);
        } else if (Array.isArray(data)) {
          setChats(data);
        }
      } catch (err) {
        console.error('[GroupChats] Error loading group chats:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const renderItem = ({ item }: { item: GroupChatSummary }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('GroupChatConversation', { chatId: item.groupChatId, name: item.name })}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.last}>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Group Chats</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateGroupChat')}>
          <Text style={styles.createText}>New</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList data={chats} keyExtractor={(item) => item.groupChatId.toString()} renderItem={renderItem} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
  },
  createButton: {
    backgroundColor: 'rgba(255,255,255,.05)',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.07)',
  },
  createText: {
    color: 'white',
  },
  item: {
    paddingVertical: 12,
    borderBottomColor: '#555',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
  },
  last: {
    color: '#DED3C4',
  },
});

export default GroupChats;