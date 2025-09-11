import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  HandRaisedIcon,
  ChatBubbleOvalLeftIcon,
  EllipsisVerticalIcon,
} from 'react-native-heroicons/outline';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from './services/postService';

type Props = {
  post: Post;
  onPress?: () => void;
};

const PostPreview: React.FC<Props> = ({ post, onPress }) => {
  const relative = formatDistanceToNow(new Date(post.dateCreated), {
    addSuffix: true,
  });
  const truncated =
    post.body.length > 256 ? `${post.body.slice(0, 256)}…` : post.body;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.user}>{post.userName ?? `User ${post.userId}`}</Text>
        <Text style={styles.time}>{relative}</Text>
        <EllipsisVerticalIcon size={20} color='white' />
      </View>
      <Text style={styles.title}>{post.subject}</Text>
      <Text style={styles.body}>{truncated}</Text>
      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <HandRaisedIcon size={16} color='white' />
          <Text style={styles.metaText}>{post.prayerCount}</Text>
        </View>
        <View style={styles.metaItem}>
          <ChatBubbleOvalLeftIcon size={16} color='white' />
          <Text style={styles.metaText}>{post.commentCount ?? 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  user: {
    color: '#fff',
    fontWeight: '600',
    flex: 1,
  },
  time: {
    color: '#ccc',
    fontSize: 12,
    marginRight: 4,
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  body: {
    color: '#fff',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
  },
});

export default PostPreview;
