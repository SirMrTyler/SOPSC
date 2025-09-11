import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";
import { EllipsisVerticalIcon } from "react-native-heroicons/outline";
import ScreenContainer from "../navigation/ScreenContainer";
import type { RootStackParamList } from "../../../App";
import {
  getPostById,
  getComments,
  prayForPost,
  deletePost,
  type Post,
  type Comment,
} from "./services/postService";
import { useAuth } from "../../hooks/useAuth";

type RouteProps = RouteProp<RootStackParamList, "PostDetails">;

const PostDetails: React.FC = () => {
  const { params } = useRoute<RouteProps>();
  const navigation = useNavigation<any>();
  const { postId } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPostById(postId);
        setPost(data);
        const commentData = await getComments(postId);
        setComments(commentData);
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

  const handleDelete = async () => {
    if (!canModify) return;
    try {
      await deletePost(post.prayerId);
      navigation.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentText}>{item.text}</Text>
      <Text style={styles.commentMeta}>
        {formatDistanceToNow(new Date(item.dateCreated), { addSuffix: true })}
      </Text>
    </View>
  );

  return (
    <ScreenContainer showBack title={post.subject} showBottomBar={false}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.meta}>
            {post.authorName} •{" "}
            {formatDistanceToNow(new Date(post.dateCreated), {
              addSuffix: true,
            })}
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
          renderItem={renderComment}
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
              <TouchableOpacity style={styles.sheetItem} onPress={() => {}}>
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
              onPress={() => navigation.navigate("Reports")}
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
  commentItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentText: {
    color: "white",
    fontSize: 14,
  },
  commentMeta: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 4,
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

