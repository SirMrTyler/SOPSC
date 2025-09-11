import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import ScreenContainer from "../Navigation/ScreenContainer";
import type { RootStackParamList } from "../../../App";

type PostDetailsRouteProp = RouteProp<RootStackParamList, "PostDetails">;

const PostDetails: React.FC = () => {
  const { params } = useRoute<PostDetailsRouteProp>();
  const { post } = params;

  return (
    <ScreenContainer showBack title={post.subject} showBottomBar={false}>
      <View style={styles.container}>
        <Text style={styles.body}>{post.body}</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  body: {
    fontSize: 16,
    color: "white",
  },
});

export default PostDetails;
