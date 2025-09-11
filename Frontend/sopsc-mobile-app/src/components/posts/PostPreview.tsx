import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import type { Post } from "./services/postService";

type Props = {
  post: Post;
  onPress: () => void;
};

const PostPreview: React.FC<Props> = ({ post, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.subject}>{post.subject}</Text>
      <Text style={styles.body} numberOfLines={2}>
        {post.body}
      </Text>
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
  subject: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: "#555",
  },
});

export default PostPreview;
