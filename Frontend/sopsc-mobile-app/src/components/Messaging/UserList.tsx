/**
 * File: UserList.tsx
 * Purpose: Presents a searchable list of users and navigates to a conversation with the selected user.
 * Notes: Creates a new conversation document if one does not already exist.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { getAll } from '../User/services/userService';
import { useAuth } from '../../hooks/useAuth';
import { UserResult } from '../../types/user';
import ScreenContainer from '../Navigation/ScreenContainer';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, collection, query as fsQuery, where, getDocs, addDoc, updateDoc, serverTimestamp } from '@react-native-firebase/firestore';

const db = getFirestore(getApp());

/**
 * UserList
 * Enables searching for other users and starting or resuming conversations.
 */
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

    /**
     * Navigates to an existing conversation or creates one if none is found.
     * @param u User selected from the list
     */
    const handleUserPress = async (u: UserResult) => {
        if (!user) return;
        try {
            const convRef = collection(db, 'conversations');
            const q = fsQuery(
                convRef,
                where(`participants.${user.firebaseUid}.userId`, '==', user.userId),
                where(`participants.${u.firebaseUid}.userId`, '==', u.userId)
            );
            const snapshot = await getDocs(q);
            let chatId: string;
            if (!snapshot.empty) {
                chatId = snapshot.docs[0].id;
            } else {
                const docRef = await addDoc(convRef, {
                    participants: {
                        [user.firebaseUid]: { userId: user.userId },
                        [u.firebaseUid]: { userId: u.userId },
                    },
                    memberProfiles: {
                        [user.userId]: {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            profilePicturePath: user.profilePicturePath || '',
                        },
                        [u.userId]: {
                            firstName: u.firstName,
                            lastName: u.lastName,
                            profilePicturePath: u.profilePicturePath || '',
                        },
                    },
                    unreadCount: { [user.userId]: 0, [u.userId]: 0 },
                    mostRecentMessage: '',
                    numMessages: 0,
                    sentTimestamp: serverTimestamp(),
                    type: 'direct',
                });
                await updateDoc(docRef, { chatId: docRef.id });
                chatId = docRef.id;
            }
            navigation.navigate('Conversation', {
                conversation: {
                    chatId: chatId,
                    mostRecentMessage: '',
                    sentTimestamp: null,
                    numMessages: 0,
                    participants: {
                        [user.firebaseUid]: { userId: user.userId },
                        [u.firebaseUid]: { userId: u.userId },
                    },
                    memberProfiles: {
                        [user.userId]: {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            profilePicturePath: user.profilePicturePath || '',
                        },
                        [u.userId]: {
                            firstName: u.firstName,
                            lastName: u.lastName,
                            profilePicturePath: u.profilePicturePath || '',
                        },
                    },
                    unreadCount: { [user.userId]: 0, [u.userId]: 0 },
                    type: 'direct',
                    otherUserId: u.userId,
                    otherUserName: `${u.firstName} ${u.lastName}`,
                    otherUserProfilePicturePath: u.profilePicturePath || '',
                },
            });
        } catch (err) {
            console.log('[UserList] error navigating to conversation', err);
        }
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

