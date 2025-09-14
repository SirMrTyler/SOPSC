/**
 * File: Inbox.tsx
 * Purpose: Shows the user's recent conversations with search and navigation shortcuts.
 * Notes: Subscribes to conversation updates and truncates message previews.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UsersIcon, PencilSquareIcon } from "react-native-heroicons/outline";
import type { RootStackParamList } from "../../../App";
import RenderMessageItem from "./Messages/RenderMessageItem";
import { useAuth } from "../../hooks/useAuth";
import {
  listenToMyConversations,
  FsConversation,
  MemberProfile,
  deleteConversation,
} from "../../types/fsMessages";
import { getAll, getById } from "../User/services/userService";
import type { UserResult } from "../../types/user";
import ScreenContainer from "../Navigation/ScreenContainer";

const PREVIEW_LENGTH = 50;

/**
 * Messages
 * Displays all user conversations and provides search and creation entry points.
 */
const Messages: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<FsConversation[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<FsConversation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [queryString, setQuery] = useState("");
  const [directory, setDirectory] = useState<Record<number, MemberProfile>>({});
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Load a user directory so we can hydrate missing names/avatars
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAll(0, 500);
        const list: UserResult[] = data?.item?.pagedItems ?? [];
        const idx: Record<number, MemberProfile> = {};
        for (const u of list) {
          idx[Number(u.userId)] = {
            firstName: u.firstName,
            lastName: u.lastName,
            profilePicturePath: (u as any).profilePicturePath,
          };
        }
        if (mounted) setDirectory(idx);
      } catch (err) {
        console.error("[Inbox] Failed to load user directory", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Subscribe to Firestore for real-time conversation updates
  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenToMyConversations(
      { userId: user.userId, firebaseUid: user.firebaseUid },
      async (list) => {
        const directConversations = list.filter((c) => c.type === "direct");
        const hydrated = await Promise.all(
          directConversations.map(async (c) => {
            const participants = Object.values(c.participants || {}) as Array<{ userId: number }>;
            const otherUserId = participants.find((p) => p.userId !== user.userId)?.userId;

            const memberProfiles: Record<string, MemberProfile> = {
              ...(c.memberProfiles || {}),
            };

            if (user.userId && !memberProfiles[String(user.userId)]) {
              memberProfiles[String(user.userId)] = {
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicturePath: user.profilePicturePath,
              };
            }

            if (otherUserId && !memberProfiles[String(otherUserId)]) {
              let prof = directory[otherUserId];
              if (!prof) {
                try {
                  const res = await getById(otherUserId);
                  prof = res?.item;
                  if (prof) {
                    setDirectory((prev) => ({ ...prev, [otherUserId]: prof! }));
                  }
                } catch (err) {
                  console.error("[Inbox] Failed to fetch user profile", err);
                }
              }
              if (prof) {
                memberProfiles[String(otherUserId)] = {
                  firstName: prof.firstName,
                  lastName: prof.lastName,
                  profilePicturePath: prof.profilePicturePath,
                };
              }
            }

            return {
              ...c,
              memberProfiles,
              mostRecentMessage:
                c.mostRecentMessage.length > PREVIEW_LENGTH
                  ? c.mostRecentMessage.slice(0, PREVIEW_LENGTH) + "..."
                  : c.mostRecentMessage,
            };
          })
        );
        setMessages(hydrated);
        setFilteredMessages(hydrated);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user, directory]);

  // Refilter messages when search input changes
  useEffect(() => {
    const q = queryString.trim().toLowerCase();
    if (!q) {
      setFilteredMessages(messages);
    } else {
      setFilteredMessages(
        messages.filter((m) => m.mostRecentMessage.toLowerCase().includes(q))
      );
    }
  }, [queryString, messages]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  const handleUserPress = (item: FsConversation) => {
    navigation.navigate("Conversation", { conversationId: item.chatId });
  };

  const handleDeleteConversation = (item: FsConversation) => {
    Alert.alert("Delete conversation?", "This will remove all messages.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteConversation(item.chatId, item.type);
          setMessages((prev) => prev.filter((m) => m.chatId !== item.chatId));
        },
      },
    ]);
  };

  return (
    <ScreenContainer showBack title="Home">
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Messages</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("GroupChats")}
            >
              <UsersIcon size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("UserList")}
            >
              <PencilSquareIcon size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor={"#DED3C4"}
            value={queryString}
            onChangeText={setQuery}
          />
        </View>
        {filteredMessages.length === 0 ? (
          <View style={styles.container}>
            <Text style={{ color: "white" }}>No messages found.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredMessages}
            keyExtractor={(item) => item.chatId.toString()}
            renderItem={({ item }) => (
              <RenderMessageItem
                conversation={item}
                onPress={() => handleUserPress(item)}
                onLongPress={() => handleDeleteConversation(item)}
              />
            )}
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
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
    padding: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
  },
  searchRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    borderColor: "white",
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: "white",
  },
  header: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 8,
    color: "white",
  },
});

export default Messages;
