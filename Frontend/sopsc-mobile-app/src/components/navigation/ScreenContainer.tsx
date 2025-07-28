import React from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from './TopBar';
import BottomBar from './BottomBar';

interface Props {
  children: React.ReactNode;
  showBottomBar?: boolean;
  showBack?: boolean;
  title?: string;
  hasUnreadMessages?: boolean;
}

const ScreenContainer: React.FC<Props> = ({
  children,
  showBottomBar = true,
  showBack = false,
  title,
  hasUnreadMessages,
}) => {
  return (
    <View style={styles.container}>
      <TopBar showBack={showBack} title={title} hasUnreadMessages={hasUnreadMessages} />
      <View style={styles.content}>{children}</View>
      {showBottomBar && <BottomBar />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenContainer;