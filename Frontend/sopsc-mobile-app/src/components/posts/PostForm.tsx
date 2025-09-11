import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import ScreenContainer from "../Navigation/ScreenContainer";
import { createPost, updatePost, getPostById } from "./services/postService";
import type { RootStackParamList } from "../../../App";

type RouteProps = RouteProp<RootStackParamList, "PostForm">;

const PostForm: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProps>();
  const postId = route.params?.postId;
  const isEdit = !!postId;
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (isEdit) {
      getPostById(postId!)
        .then((p) => {
          setSubject(p.subject);
          setBody(p.body);
        })
        .catch((err) => console.error(err));
    }
  }, [isEdit, postId]);

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await updatePost(postId!, { subject, body });
        navigation.navigate("PostDetails", { postId: postId! });
      } else {
        const id = await createPost({ subject, body });
        navigation.navigate("PostDetails", { postId: id });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScreenContainer
      showBack
      title={isEdit ? "Edit Post" : "New Post"}
      showBottomBar={false}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Subject"
          placeholderTextColor="#ccc"
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Body"
          placeholderTextColor="#ccc"
          value={body}
          onChangeText={setBody}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {isEdit ? "Edit Post" : "Create Post"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  body: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#333",
    fontWeight: "600",
  },
});

export default PostForm;
