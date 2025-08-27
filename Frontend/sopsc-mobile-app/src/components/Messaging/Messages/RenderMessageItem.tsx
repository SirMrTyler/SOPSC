/**
 * File: RenderMessageItem.tsx
 * Purpose: Renders a preview row for a conversation in the inbox list.
 * Notes: Shows read status and timestamp for the latest message.
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FsConversation } from '../../../types/fsMessages';
import { formatTimestamp } from '../../../utils/date';
import defaultAvatar from '../../../../assets/images/default-avatar.png';
import { useAuth } from '../../../hooks/useAuth';
import { useUnreadCount } from '../../../hooks/useUnreadCount';
interface Props {
  conversation: FsConversation;
  onPress: () => void;
  onLongPress?: () => void;
}

/**
 * ConversationItem
 * Displays conversation metadata including read status and timestamp.
 */
const ConversationItem: React.FC<Props> = ({ conversation, onPress, onLongPress }) => {
  const { user } = useAuth();
  const unread = useUnreadCount(conversation.chatId, user?.userId);
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
            <Text style={styles.time}>{formatTimestamp(conversation.sentTimestamp)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.message} numberOfLines={1}>
              {conversation.mostRecentMessage}
            </Text>
            {/* Display read status only for messages the user sent */}
            {conversation.isLastMessageFromUser && (
              <Text style={styles.status}>
                {conversation.isRead ? 'Read' : 'Unread'}
              </Text>
            )}
          </View>
        </View>
        {(unread > 0 || (!conversation.isRead && !conversation.isLastMessageFromUser)) && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread > 0 ? unread : 1}</Text>
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
