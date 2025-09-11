import React, { useState, useCallback } from "react";
import { FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { PlusIcon } from "react-native-heroicons/outline";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ScreenContainer from "../Navigation/ScreenContainer";
import PostPreview from "./PostPreview";
import { getPosts, Post } from "./services/postService";
import type { RootStackParamList } from "../../../App";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const data = await getPosts();
    setPosts(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const handleRemove = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.prayerId !== id));
  };

  const renderItem = ({ item }: { item: Post }) => (
    <PostPreview
      post={item}
      onPress={() =>
        navigation.navigate("PostDetails", { postId: item.prayerId })
      }
      onDeleted={handleRemove}
    />
  );

  return (
    <ScreenContainer
      title="Prayer Requests"
      rightComponent={
        <TouchableOpacity onPress={() => navigation.navigate("PostForm")}>
          <PlusIcon color="white" size={22} />
        </TouchableOpacity>
      }
    >
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.prayerId.toString()}
          renderItem={renderItem}
        />
      )}
    </ScreenContainer>
  );
};

export default PostList;
