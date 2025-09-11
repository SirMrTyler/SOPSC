import React, { useEffect, useState } from "react";
import { FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ScreenContainer from "../navigation/ScreenContainer";
import PostPreview from "./PostPreview";
import { getPosts, Post } from "./services/postService";
import type { RootStackParamList } from "../../../App";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts();
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("PostDetails", { post: item })}
    >
      <PostPreview post={item} />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer title="Prayer Requests">
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
