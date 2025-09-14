import React from "react";
import { View, StyleSheet } from "react-native";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

interface Props {
  children: React.ReactNode;
  showBottomBar?: boolean;
  showBack?: boolean;
  title?: string;
  pageTitle?: string;
  hasUnreadMessages?: boolean;
  rightComponent?: React.ReactNode;
}

const ScreenContainer: React.FC<Props> = ({
  children,
  showBottomBar = true,
  showBack = false,
  title,
  pageTitle,
  hasUnreadMessages,
  rightComponent,
}) => {
  return (
    <View style={styles.container}>
      <TopBar
        showBack={showBack}
        title={title}
        pageTitle={pageTitle}
        hasUnreadMessages={hasUnreadMessages}
        rightComponent={rightComponent}
      />
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
