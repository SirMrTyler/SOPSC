import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageConversation } from '../../types/messages';
import { formatTimestamp } from '../../utils/date';

interface Props {
  conversation: MessageConversation;
  onPress: () => void;
}

const ConversationItem: React.FC<Props> = ({ conversation, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: conversation.otherUserProfilePicturePath }}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name}>{conversation.otherUserName}</Text>
          <Text style={styles.time}>{formatTimestamp(conversation.sentTimestamp)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.message} numberOfLines={1}>
            {conversation.mostRecentMessage}
          </Text>
            {conversation.isLastMessageFromUser && (
            <Text style={styles.status}>
              {conversation.isRead ? 'Read' : 'Unread'}
            </Text>
          )}
        </View>
      </View>
      {conversation.numMessages > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{conversation.numMessages}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
  },
  message: {
    color: '#555',
  },
  time: {
    color: '#666',
    fontSize: 12,
  },
  status: {
    color: '#666',
    fontSize: 12,
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
});

export default ConversationItem;