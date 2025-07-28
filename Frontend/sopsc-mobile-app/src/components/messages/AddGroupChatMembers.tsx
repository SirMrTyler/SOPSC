import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { getAll } from '../../services/userService';
import { addMembers } from '../../services/groupChatService';
import { UserResult } from '../../types/user';
import ScreenContainer from '../navigation/ScreenContainer';

const roleNames: Record<number, string> = {
  1: 'Developer',
  2: 'Admin',
  3: 'Member',
  4: 'Guest',
};

type Props = NativeStackScreenProps<RootStackParamList, 'AddGroupChatMembers'>;

const AddGroupChatMembers: React.FC<Props> = ({ route, navigation }) => {
  const { chatId } = route.params;
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserResult[]>([]);
  const [results, setResults] = useState<UserResult[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAll(0, 200);
        const list = data?.item?.pagedItems || [];
        setUsers(list);
        setResults(list);
      } catch {
        setUsers([]);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults(users);
    } else {
      setResults(users.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)));
    }
  }, [query, users]);

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAdd = async () => {
    if (selected.length === 0) return;
    try {
      await addMembers(chatId, selected);
      navigation.goBack();
    } catch (err) {
      console.error('[AddGroupChatMembers] Error adding members:', err);
    }
  };

  const renderItem = ({ item }: { item: UserResult }) => (
    <TouchableOpacity style={styles.item} onPress={() => toggleSelect(item.userId)}>
      <View style={styles.itemRow}>
        <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.role}>{roleNames[item.roleId] || String(item.roleId)}</Text>
      </View>
      {selected.includes(item.userId) && <Text style={styles.check}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder='Search users...'
            placeholderTextColor='#DED3C4'
            value={query}
            onChangeText={setQuery}
          />
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList data={results} keyExtractor={item => item.userId.toString()} renderItem={renderItem} />
        )}
        <Button title='Add Members' onPress={handleAdd} disabled={selected.length === 0} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  item: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#555',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: 'white',
    marginRight: 8,
  },
  role: {
    color: '#DED3C4',
  },
  check: {
    color: 'white',
  },
});

export default AddGroupChatMembers;