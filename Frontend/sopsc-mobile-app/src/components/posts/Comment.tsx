import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { timeAgo } from '../../utils/timeAgo';
import type { Comment as BaseComment } from './services/postService';

export interface CommentNode extends BaseComment {
  authorName: string;
  replies?: CommentNode[];
}

interface Props {
  comment: CommentNode;
  depth?: number;
  onPray: (id: number) => void;
}

const Comment: React.FC<Props> = ({ comment, depth = 0, onPray }) => {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const replies = comment.replies ?? [];
  const visibleReplies = showAllReplies ? replies : replies.slice(0, 1);

  return (
    <View style={[styles.container, { marginLeft: depth * 16 }] }>
      <Text style={styles.meta}>
        {comment.authorName} •{' '}
        {timeAgo(comment.dateCreated)}
      </Text>
      <Text style={styles.body}>{comment.text}</Text>
      <TouchableOpacity
        onPress={() => onPray(comment.commentId)}
        style={styles.prayButton}
      >
        <Text style={styles.prayText}>🙏 {comment.prayerCount}</Text>
      </TouchableOpacity>
      {visibleReplies.map((child) => (
        <Comment
          key={child.commentId}
          comment={child}
          depth={depth + 1}
          onPray={onPray}
        />
      ))}
      {replies.length > visibleReplies.length && (
        <TouchableOpacity
          style={styles.loadMore}
          onPress={() => setShowAllReplies(true)}
        >
          <Text style={styles.loadMoreText}>Load more replies</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 4,
  },
  body: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  prayButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginTop: 4,
  },
  prayText: {
    color: '#333',
    fontSize: 12,
  },
  loadMore: {
    marginTop: 4,
  },
  loadMoreText: {
    color: '#80bfff',
    fontSize: 12,
  },
});

export default Comment;
