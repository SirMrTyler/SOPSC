import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../navigation/ScreenContainer';

const PostDetails: React.FC = () => {
  return (
    <ScreenContainer showBack title='Post Details'>
      <View style={styles.container}>
        <Text style={styles.text}>Post Details Screen</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});

export default PostDetails;
