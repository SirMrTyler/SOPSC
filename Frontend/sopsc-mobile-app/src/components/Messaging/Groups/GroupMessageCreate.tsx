/**
 * File: GroupMessageCreate.tsx
 * Purpose: Form for creating a new group chat and navigating back to the inbox.
 * Notes: Minimal validation and uses group chat service for creation.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../../App';
import ScreenContainer from '../../Navigation/ScreenContainer';
import { createGroup } from '../services/groupChatFs';
import { useAuth } from '../../../hooks/useAuth';

/**
 * CreateGroupChat
 * Collects a name from the user and creates a group chat via the service layer.
 */
const CreateGroupChat: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);

    /**
     * Sends the new group name to the API and navigates back on success.
     */
    const handleCreate = async () => {
        if (!user || !name.trim()) return;
        setSaving(true);
        try {
            await createGroup(name.trim(), {
                userId: user.userId,
                firebaseUid: user.firebaseUid,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicturePath: user.profilePicturePath,
            });
            navigation.goBack();
        } catch (err) {
            console.error('[CreateGroupChat] Error:', err);
            Alert.alert('Error', 'Failed to create group chat');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Group name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                />
                <Button title="Create" onPress={handleCreate} disabled={saving || !name.trim()} />
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 8,
        paddingHorizontal: 8,
        color: 'white',
    }
});

export default CreateGroupChat;