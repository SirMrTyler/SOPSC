import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { getAll } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { UserResult } from '../../types/user';
import ScreenContainer from '../navigation/ScreenContainer';

const UserList: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserResult[]>([]);
    const [results, setResults] = useState<UserResult[]>([]);

    // Load all users once on mount
    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            try {
                const data = await getAll(0, 200);
                const fetched = data?.item?.pagedItems || [];
                const filtered = user ? fetched.filter(u => u.userId !== user.userId) : fetched;
                setUsers(filtered);
                setResults(filtered);
            } catch (err: any) {
                const sCode = err.response?.status;
                console.log('[UserList] sCode: ', sCode);
                setUsers([]);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const q = query.trim().toLowerCase();
            if (q) {
                setResults(users.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)));
            } else {
                setResults(users);
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [query, users]);

    const handleUserPress = (u: UserResult) => {
        navigation.navigate('Conversation', {
            conversation: {
                messageId: 0,
                chatId: 0,
                otherUserId: u.userId,
                otherUserName: `${u.firstName} ${u.lastName}`,
                otherUserProfilePicturePath: u.profilePicturePath || '',
                mostRecentMessage: '',
                isRead: true,
                sentTimestamp: '',
                numMessages: 0,
                isLastMessageFromUser: false,
            },
        });
    };

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Search users...'
                        placeholderTextColor={'#DED3C4'}
                        value={query}
                        onChangeText={setQuery}
                    />
                </View>
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.userId.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.item} onPress={() => handleUserPress(item)}>
                                <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
                            </TouchableOpacity>
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
    },
    name: {
        color: 'white',
    },
});

export default UserList;