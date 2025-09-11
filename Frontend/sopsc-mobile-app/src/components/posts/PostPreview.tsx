import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { ChatBubbleOvalLeftIcon, EllipsisVerticalIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { timeAgo } from "../../utils/timeAgo";
import type { Post } from "./services/postService";
import { deletePost, reportPost } from "./services/postService";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  post: Post;
  onPress?: () => void; // ✅ allow parent to pass a tap handler
};

const PostPreview: React.FC<Props> = ({ post, onPress }) => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  const bodyPreview =
    post.body.length > 256 ? `${post.body.slice(0, 256)}…` : post.body;

  const isAdmin = user?.Roles?.some(
    (r) => r.roleName === "Admin" || r.roleName === "Administrator"
  );
  const isOwner = user?.userId === post.userId;

  const handleDelete = async () => {
    if (!(isOwner || isAdmin)) return;
    try {
      await deletePost(post.prayerId);
      Alert.alert("Post deleted");
    } catch (err) {
      console.error(err);
    } finally {
      setMenuVisible(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportMessage.trim()) return;
    try {
      await reportPost(post.prayerId, reportMessage);
      Alert.alert("Report submitted");
      setReportMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setReportVisible(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress} // no focus/opacity change when not clickable
    >
      <Text style={styles.title}>{post.subject}</Text>
      <View style={styles.headerRow}>
        <Text style={styles.meta}>
          {post.authorName} • {timeAgo(post.dateCreated)}
        </Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <EllipsisVerticalIcon color="#555" size={16} />
        </TouchableOpacity>
      </View>
      <Text style={styles.body}>{bodyPreview}</Text>
      <View style={styles.footer}>
        <Text style={styles.count}>🙏 {post.prayerCount}</Text>
        <View style={styles.comments}>
          <ChatBubbleOvalLeftIcon color="#555" size={16} />
          <Text style={styles.commentText}>{post.commentCount}</Text>
        </View>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          onPress={() => setMenuVisible(false)}
        />
        <View style={styles.sheet}>
          {isOwner && (
            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("PostForm", { postId: post.prayerId });
              }}
            >
              <Text style={styles.sheetText}>Edit</Text>
            </TouchableOpacity>
          )}
          {(isOwner || isAdmin) && (
            <TouchableOpacity style={styles.sheetItem} onPress={handleDelete}>
              <Text style={styles.sheetText}>Delete</Text>
            </TouchableOpacity>
          )}
          {!isOwner && !isAdmin && (
            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => {
                setMenuVisible(false);
                setReportVisible(true);
              }}
            >
              <Text style={styles.sheetText}>Report</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.sheetItem}
            onPress={() => setMenuVisible(false)}
          >
            <Text style={styles.sheetText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={reportVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReportVisible(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          onPress={() => setReportVisible(false)}
        />
        <View style={styles.sheet}>
          <TextInput
            style={styles.input}
            placeholder="Describe the issue"
            placeholderTextColor="#ccc"
            value={reportMessage}
            onChangeText={setReportMessage}
          />
          <TouchableOpacity
            style={styles.sheetItem}
            onPress={handleReportSubmit}
          >
            <Text style={styles.sheetText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sheetItem}
            onPress={() => setReportVisible(false)}
          >
            <Text style={styles.sheetText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  meta: { fontSize: 12, color: "#555" },
  body: { fontSize: 14, color: "#333", marginBottom: 12 },
  footer: { flexDirection: "row", alignItems: "center", gap: 16 },
  count: { fontSize: 14, color: "#555" },
  comments: { flexDirection: "row", alignItems: "center", gap: 4 },
  commentText: { fontSize: 14, color: "#555" },
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingBottom: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sheetItem: {
    padding: 16,
  },
  sheetText: {
    fontSize: 16,
    textAlign: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
    borderRadius: 8,
  },
});

export default PostPreview;
