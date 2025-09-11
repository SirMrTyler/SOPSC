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
import { EllipsisVerticalIcon } from "react-native-heroicons/outline";
import { timeAgo } from "../../utils/timeAgo";
import type { Comment as BaseComment } from "./services/postService";
import { deleteComment } from "./services/postService";
import { useAuth } from "../../hooks/useAuth";

export interface CommentNode extends BaseComment {
  authorName: string;
  replies?: CommentNode[];
}

interface Props {
  comment: CommentNode;
  depth?: number;
  onPray: (id: number) => void;
  onDelete: (id: number) => void;
}

const Comment: React.FC<Props> = ({ comment, depth = 0, onPray, onDelete }) => {
  const { user } = useAuth();
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const replies = comment.replies ?? [];
  const visibleReplies = showAllReplies ? replies : replies.slice(0, 1);

  const isAdmin = user?.Roles?.some(
    (r) => r.roleName === "Admin" || r.roleName === "Administrator"
  );
  const isOwner = Number(user?.userId) === Number(comment.userId);

  const handleDelete = async () => {
    if (!(isOwner || isAdmin)) return;
    try {
      await deleteComment(comment.commentId);
      onDelete(comment.commentId);
    } catch (err) {
      console.error(err);
    } finally {
      setMenuVisible(false);
    }
  };

  const handleReportSubmit = () => {
    if (!reportMessage.trim()) return;
    Alert.alert("Report submitted");
    setReportMessage("");
    setReportVisible(false);
  };

  return (
    <View style={[styles.container, { marginLeft: depth * 16 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.meta}>
          {comment.authorName} • {timeAgo(comment.dateCreated)}
        </Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <EllipsisVerticalIcon size={16} color="#ccc" />
        </TouchableOpacity>
      </View>
      <Text style={styles.body}>{comment.text}</Text>
      <TouchableOpacity
        onPress={() => onPray(comment.commentId)}
        style={[styles.prayButton, comment.hasPrayed && styles.prayedButton]}
      >
        <Text style={styles.prayText}>🙏 {comment.prayerCount}</Text>
      </TouchableOpacity>
      {visibleReplies.map((child) => (
        <Comment
          key={child.commentId}
          comment={child}
          depth={depth + 1}
          onPray={onPray}
          onDelete={onDelete}
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
                Alert.alert("Edit not implemented");
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: "#ccc",
  },
  body: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  prayButton: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginTop: 4,
  },
  prayedButton: {
    backgroundColor: "#FFD700",
  },
  prayText: {
    color: "#333",
    fontSize: 12,
  },
  loadMore: {
    marginTop: 4,
  },
  loadMoreText: {
    color: "#80bfff",
    fontSize: 12,
  },
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

export default Comment;
