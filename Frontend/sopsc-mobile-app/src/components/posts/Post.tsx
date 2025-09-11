import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import ScreenContainer from '../navigation/ScreenContainer';
import PostPreview from './PostPreview';
import * as postService from './services/postService';

const postName = 'Prayer Requests';

const Posts: React.FC = () => {
  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackParamList>
  >();
  const [posts, setPosts] = useState<postService.Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadPosts();
    }, [loadPosts])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts();
  }, [loadPosts]);

  const renderItem = ({ item }: { item: postService.Post }) => (
    <PostPreview
      post={item}
      onPress={() => navigation.navigate('PostDetails', { postId: item.prayerId })}
    />
  );

  return (
    <ScreenContainer showBack title={postName}>
      {loading && !refreshing ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.prayerId.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            !loading ? <Text style={styles.empty}>No posts yet.</Text> : null
          }
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#ccc',
    marginTop: 20,
  },
});

export default Posts;
