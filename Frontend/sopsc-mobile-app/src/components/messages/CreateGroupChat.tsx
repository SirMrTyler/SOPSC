import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreateGroupChat: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Group chat creation coming soon!</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white'
    }
});

export default CreateGroupChat;