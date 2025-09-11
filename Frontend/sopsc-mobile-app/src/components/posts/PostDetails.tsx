import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { timeAgo } from "../../utils/timeAgo";
import { EllipsisVerticalIcon } from "react-native-heroicons/outline";
import ScreenContainer from "../Navigation/ScreenContainer";
import type { RootStackParamList } from "../../../App";
import {
  getPostById,
  getComments,
  prayForPost,
  prayForComment,
  deletePost,
  reportPost,
  type Post,
  addComment,
} from "./services/postService";
import { useAuth } from "../../hooks/useAuth";
import CommentComponent, { CommentNode } from "./Comment";

type RouteProps = RouteProp<RootStackParamList, "PostDetails">;

const PostDetails: React.FC = () => {
  const { params } = useRoute<RouteProps>();
  const navigation = useNavigation<any>();
  const { postId } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [reportVisible, setReportVisible] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const { user } = useAuth();

  const buildCommentTree = (items: CommentNode[]): CommentNode[] => {
    const map = new Map<number, CommentNode>();
    const roots: CommentNode[] = [];
    items.forEach((c) => map.set(c.commentId, { ...c, replies: [] }));
    map.forEach((c) => {
      if (c.parentCommentId) {
        const parent = map.get(c.parentCommentId);
        if (parent) {
          parent.replies!.push(c);
        } else {
          roots.push(c);
        }
      } else {
        roots.push(c);
      }
    });
    return roots;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPostById(postId);
        setPost(data);
        const commentData = (await getComments(postId)) as CommentNode[];
        setComments(buildCommentTree(commentData));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId]);

  if (loading || !post) {
    return (
      <ScreenContainer showBack title="Post" showBottomBar={false}>
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  const isAdmin = user?.Roles?.some(
    (r) => r.roleName === "Admin" || r.roleName === "Administrator"
  );
  const canModify = !!user && (user.userId === post.userId || isAdmin);

  const handlePray = async () => {
    try {
      await prayForPost(post.prayerId);
      setPost((prev) =>
        prev ? { ...prev, prayerCount: prev.prayerCount + 1 } : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentPray = async (id: number) => {
    try {
      await prayForComment(id);
      const increment = (items: CommentNode[]): CommentNode[] =>
        items.map((c) => {
          if (c.commentId === id) {
            return { ...c, prayerCount: c.prayerCount + 1 };
          }
          if (c.replies && c.replies.length) {
            return { ...c, replies: increment(c.replies) };
          }
          return c;
        });
      setComments((prev) => increment(prev));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const newId = await addComment(postId, { text: newComment });
      const comment: CommentNode = {
        commentId: newId,
        prayerId: postId,
        userId: user?.userId ?? 0,
        text: newComment,
        dateCreated: new Date().toISOString(),
        prayerCount: 0,
        authorName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
        replies: [],
      };
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } catch (err) {
      console.error(err);
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

  const handleDelete = async () => {
    if (!canModify) return;
    try {
      await deletePost(post.prayerId);
      navigation.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScreenContainer showBack title={post.subject} showBottomBar={false}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.meta}>
            {post.authorName} • {timeAgo(post.dateCreated)}
          </Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <EllipsisVerticalIcon size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.body}>{post.body}</Text>
        <TouchableOpacity style={styles.prayButton} onPress={handlePray}>
          <Text style={styles.prayText}>🙏 {post.prayerCount}</Text>
        </TouchableOpacity>
        <Text style={styles.commentHeader}>Comments</Text>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.commentId.toString()}
          renderItem={({ item }) => (
            <CommentComponent comment={item} onPray={handleCommentPray} />
          )}
          ListFooterComponent={
            <View style={styles.composer}>
              <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                placeholderTextColor="#ccc"
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleAddComment}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          }
        />
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
          {canModify && (
            <>
              <TouchableOpacity
                style={styles.sheetItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("PostForm", { postId: post.prayerId });
                }}
              >
                <Text style={styles.sheetText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetItem} onPress={handleDelete}>
                <Text style={styles.sheetText}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
          {!canModify && (
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
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: "white",
  },
  body: {
    fontSize: 16,
    color: "white",
    marginBottom: 12,
  },
  prayButton: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 16,
  },
  prayText: {
    color: "#333",
    fontSize: 14,
  },
  commentHeader: {
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    color: "white",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#333",
    fontSize: 14,
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
});

export default PostDetails;
