import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FsConversation } from '../../services/fsMessages';
import { formatTimestamp } from '../../utils/date';
import defaultAvatar from '../../../assets/images/default-avatar.png';
interface Props {
  conversation: FsConversation;
  onPress: () => void;
  onLongPress?: () => void;
}

const ConversationItem: React.FC<Props> = ({ conversation, onPress, onLongPress }) => {
  return (
    <View style={styles.messageBox}>
      <TouchableOpacity style={styles.container} onPress={onPress} onLongPress={onLongPress}>
        <Image
          source={conversation.otherUserProfilePicturePath ? { uri: conversation.otherUserProfilePicturePath } : defaultAvatar}
          style={styles.avatar}
        />
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.name}>{conversation.otherUserName}</Text>
            <Text style={styles.time}>{formatTimestamp(String(conversation.sentTimestamp))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.message} numberOfLines={1}>
              {conversation.mostRecentMessage}
            </Text>
            {/** I need this piece of information to display the read status in real time */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, .05)',
    borderRadius: 12,
    padding: 6,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, .07)',
  },
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
    color: 'white',
  },
  message: {
    color: '#DED3C4',
  },
  time: {
    color: '#DED3C4',
    fontSize: 12,
  },
  status: {
    color: '#DED3C4',
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