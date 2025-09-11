import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChatBubbleOvalLeftIcon } from "react-native-heroicons/outline";
import { timeAgo } from "../../utils/timeAgo";
import type { Post } from "./services/postService";

type Props = {
  post: Post;
  onPress?: () => void; // ✅ allow parent to pass a tap handler
};

const PostPreview: React.FC<Props> = ({ post, onPress }) => {
  const bodyPreview =
    post.body.length > 256 ? `${post.body.slice(0, 256)}…` : post.body;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress} // no focus/opacity change when not clickable
    >
      <Text style={styles.title}>{post.subject}</Text>
      <Text style={styles.meta}>
        {post.authorName} • {timeAgo(post.dateCreated)}
      </Text>
      <Text style={styles.body}>{bodyPreview}</Text>
      <View style={styles.footer}>
        <Text style={styles.count}>🙏 {post.prayerCount}</Text>
        <View style={styles.comments}>
          <ChatBubbleOvalLeftIcon color="#555" size={16} />
          <Text style={styles.commentText}>{post.commentCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  meta: { fontSize: 12, color: "#555", marginBottom: 8 },
  body: { fontSize: 14, color: "#333", marginBottom: 12 },
  footer: { flexDirection: "row", alignItems: "center", gap: 16 },
  count: { fontSize: 14, color: "#555" },
  comments: { flexDirection: "row", alignItems: "center", gap: 4 },
  commentText: { fontSize: 14, color: "#555" },
});

export default PostPreview;
