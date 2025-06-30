import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { MessageConversation } from '../../types/messages';

type Props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;

const Conversation: React.FC<Props> = ({ route }) => {
  const { conversation } = route.params;
  return (
    <View style={styles.container}>
      <Text>Conversation with {conversation.otherUserName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Conversation;