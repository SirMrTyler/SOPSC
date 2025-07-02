import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { search } from '../../services/userService.js';
import { useAuth } from '../../hooks/useAuth';
import { UserResult } from '../../types/user';

const UserList: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<UserResult[]>([]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await search(query.trim(), 0, 20);
            const fetched = data?.item?.pagedItems || [];
            console.log('[UserList] Fetched users:', fetched);
            const filtered = user ? fetched.filter(u => u.userId !== user.userId) : fetched;
            setResults(filtered);
        } catch (err: any) {
            const sCode = err.response?.status;
            console.log('[UserList] sCode: ', sCode);
            if (sCode === 404) {
                setResults([]);
            } 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query.trim()) {
                handleSearch();
            } else {
                setResults([]);
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [query]);

    const handleUserPress = (u: UserResult) => {
        navigation.navigate('Conversation', {
            conversation: {
                messageId: 0,
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