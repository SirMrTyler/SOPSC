/**
 * File: RenderGroupMessage.tsx
 * Purpose: Renders a group chat conversation and provides input to send messages.
 * Notes: Subscribes to Firestore collection for real-time updates.
 */
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../../App";
import { useAuth } from "../../../hooks/useAuth";
import ScreenContainer from "../../Navigation/ScreenContainer";
import { formatTimestamp } from "../../../utils/date";
import {
  FsMessage,
  FsConversation,
  listenToConversationMessages,
  getFsConversation,
  markConversationRead,
  sendMessage,
} from "../../../types/fsMessages";
import { UserPlusIcon } from "react-native-heroicons/outline";
import defaultAvatar from "../../../../assets/images/default-avatar.png";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "GroupChatConversation"> {}

/**
 * GroupChatConversation
 * Displays messages for the specified group chat and handles sending new messages.
 */
const GroupChatConversation: React.FC<Props> = ({ route, navigation }) => {
  const { chatId, name } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<FsMessage[]>([]);
  const [conversation, setConversation] = useState<FsConversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList<FsMessage>>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    getFsConversation(chatId, user?.userId ?? 0).then(setConversation);
    const unsub = listenToConversationMessages(chatId, setMessages);
    return () => unsub();
  }, [chatId, user?.userId]);

  useEffect(() => {
    if (messages.length) {
      setExpanded(new Set([messages[messages.length - 1].messageId]));
    }
  }, [messages]);

  // Mark as read whenever messages change (live read receipts + badge clear)
  useEffect(() => {
    if (!user || messages.length === 0) return;
    markConversationRead(
      chatId,
      { userId: user.userId, firebaseUid: user.firebaseUid },
      messages
    ).catch(() => {});
  }, [chatId, user, messages]);

  //Also mark as read right when the screen regains focus (covers quick back/forward nav)
  useFocusEffect(
    useCallback(() => {
      if (!user || messages.length === 0) return;
      markConversationRead(
        chatId,
        { userId: user.userId, firebaseUid: user.firebaseUid },
        messages
      ).catch(() => {});
    }, [chatId, user, messages])
  );

  /**
   * Persists a new message document and scrolls the list to the latest entry.
   */
  const handleSend = async () => {
    if (!user || !newMessage.trim() || !conversation) return;
    const recipients = Object.entries(conversation.participants || {})
      .filter(([_, info]) => info.userId !== user.userId)
      .map(([firebaseUid, info]) => ({ firebaseUid, userId: info.userId }));
    const message = newMessage.trim();
    await sendMessage(
      String(chatId),
      {
        userId: user.userId,
        firebaseUid: user.firebaseUid,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicturePath: user.profilePicturePath,
      },
      message,
      "group",
      recipients
    );
    setNewMessage("");
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  /**
   * Renders a message bubble with timestamp and sender name.
   */
  const renderItem = ({ item }: { item: FsMessage }) => {
    if (!conversation) return null;
    const outgoing = item.senderId === user?.userId;
    const readers = Object.keys(item.readBy || {})
      .map((uid) => {
        const userId = conversation.participants[uid]?.userId;
        if (userId === item.senderId) return null;
        const prof = userId ? conversation.memberProfiles[userId] : undefined;
        return prof ? { userId, ...prof } : null;
      })
      .filter(Boolean) as {
      userId: number;
      firstName: string;
      lastName: string;
      profilePicturePath?: string;
    }[];
    const showReaders = expanded.has(item.messageId);
    return (
      <TouchableOpacity
        onPress={() => toggleExpanded(item.messageId)}
        activeOpacity={0.8}
      >
        <View
          style={[styles.msgBox, outgoing ? styles.msgRight : styles.msgLeft]}
        >
          <Text
            style={[
              styles.msgAuthor,
              outgoing ? styles.msgAuthorRight : styles.msgAuthorLeft,
            ]}
          >
            {item.senderName}
          </Text>
          <Text
            style={[
              styles.msgText,
              outgoing ? styles.msgTextRight : styles.msgTextLeft,
            ]}
          >
            {item.messageContent}
          </Text>
          <View style={styles.meta}>
            <Text
              style={[
                styles.time,
                outgoing ? styles.timeRight : styles.timeLeft,
              ]}
            >
              {formatTimestamp(item.sentTimestamp)}
            </Text>
          </View>
          {readers.length > 0 && showReaders && (
            <View
              style={[
                styles.readReceiptRow,
                { alignSelf: outgoing ? "flex-end" : "flex-start" },
              ]}
            >
              <Text
                style={[
                  styles.readByLabel,
                  outgoing ? styles.timeRight : styles.timeLeft,
                ]}
              >
                ReadBy:
              </Text>
              <View style={styles.readers}>
                {readers.map((p) => (
                  <Image
                    key={p.userId}
                    source={
                      p.profilePicturePath
                        ? { uri: p.profilePicturePath }
                        : defaultAvatar
                    }
                    style={styles.readerAvatar}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const memberNames = conversation
    ? Object.values(conversation.memberProfiles)
        .map((m) => `${m.firstName} ${m.lastName}`.trim())
        .join(", ")
    : "";

  return (
    <ScreenContainer
      showBottomBar={false}
      showBack
      title={name}
      rightComponent={
        <TouchableOpacity
          onPress={() => navigation.navigate("AddGroupChatMembers", { chatId })}
        >
          <UserPlusIcon color="white" size={22} />
        </TouchableOpacity>
      }
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={/* top bar height */ 0}
      >
        {conversation && (
          <Text style={styles.membersText}>
            <Text style={styles.membersLabel}>Members: </Text>
            {memberNames}
          </Text>
        )}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.messageId}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            placeholderTextColor="#999"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <Button
            title="Send"
            onPress={handleSend}
            disabled={!newMessage.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  msgBox: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
    maxWidth: "82%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  msgLeft: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(18, 32, 47, 0.92)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
  },
  msgRight: {
    alignSelf: "flex-end",
    backgroundColor: "#cfe9ff",
    borderColor: "rgba(0,0,0,0.06)",
    borderWidth: 1,
  },
  msgText: {
    fontSize: 16,
    lineHeight: 21,
  },
  msgTextLeft: {
    color: "#fff",
  },
  msgTextRight: {
    color: "#0b2138", // NEW: deep navy for readability on light bubble
  },
  msgAuthor: { fontWeight: "bold" },
  msgAuthorLeft: { color: "rgba(255,255,255,0.9)" },
  msgAuthorRight: { color: "#0b2138" },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  time: { fontSize: 12, color: "#666" },
  timeLeft: { color: "rgba(255,255,255,0.75)" },
  timeRight: { color: "rgba(11,33,56,0.7)" },
  readReceiptRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  readByLabel: { fontSize: 12, marginRight: 6 },
  readers: {
    flexDirection: "row",
  },
  readerAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  membersText: { marginBottom: 8 },
  membersLabel: { fontWeight: "bold" },
});

export default GroupChatConversation;
