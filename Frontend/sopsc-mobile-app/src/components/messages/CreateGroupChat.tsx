import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { create } from '../../services/groupChatService';
import ScreenContainer from '../navigation/ScreenContainer';

const CreateGroupChat: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) return;
        setSaving(true);
        try {
            await create(name.trim(), []);
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