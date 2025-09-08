/**
 * File: GroupInbox.tsx
 * Purpose: Displays a list of group chats and provides navigation to conversations or creation.
 * Notes: Fetches group chat summaries on mount.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../../../../App";
import ScreenContainer from "../../Navigation/ScreenContainer";
import { listenToGroupChats } from "../services/groupChatFs";
import { FsConversation } from "../../../types/fsMessages";
import { useAuth } from "../../../hooks/useAuth";
import { formatTimestamp } from "../../../utils/date";

/**
 * GroupChats
 * Lists all group chat conversations for the current user.
 */
const GroupChats: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [chats, setChats] = useState<FsConversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to group chat summaries
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsub = listenToGroupChats(
      { userId: user.userId, firebaseUid: user.firebaseUid },
      (list) => {
        setChats(list);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const renderItem = ({ item }: { item: FsConversation }) => {
    const unread = item.unreadCount?.[user?.firebaseUid || ""] || 0;
    const groupName =
      (item as any).name ||
      item.otherUserName ||
      (item as any).groupName ||
      (item.memberProfiles
        ? Object.values(item.memberProfiles)
            .slice(0, 3)
            .map((m: any) => `${m.firstName} ${m.lastName}`.trim())
            .join(", ")
        : "") ||
      "Group Chat";
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate("GroupChatConversation", {
            chatId: item.chatId,
            name: groupName,
          })
        }
      >
        <View style={styles.rowBetween}>
          <Text style={styles.name}>{groupName}</Text>
          <Text style={styles.membersCount}>
            <Text style={styles.membersLabel}>Members: </Text>
            {Object.keys(item.participants).length}
          </Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.last} numberOfLines={1} ellipsizeMode="tail">
            {item.mostRecentMessage}
          </Text>
          <Text style={[styles.time, unread > 0 && { marginRight: 24 }]}>
            {formatTimestamp(item.sentTimestamp)}
          </Text>
        </View>
        {unread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer showBack title="Messages">
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Group Chats</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("CreateGroupChat")}
          >
            <Text style={styles.createText}>New</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.chatId}
            renderItem={renderItem}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  header: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
  },
  createButton: {
    backgroundColor: "rgba(255,255,255,.05)",
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.07)",
  },
  createText: {
    color: "white",
  },
  item: {
    paddingVertical: 12,
    borderBottomColor: "#555",
    borderBottomWidth: StyleSheet.hairlineWidth,
    position: "relative",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: "white",
    fontWeight: "bold",
  },
  membersCount: {
    color: "#DED3C4",
  },
  membersLabel: {
    fontWeight: "bold",
  },
  last: {
    color: "#DED3C4",
  },
  time: {
    color: "#DED3C4",
  },
  badge: {
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: "absolute",
    right: 0,
    bottom: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
});

export default GroupChats;
