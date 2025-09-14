/**
 * File: RenderMessage.tsx
 * Purpose: Displays a direct conversation thread and allows sending new messages.
 * Notes: Marks messages as read when viewed and scrolls to the latest on send.
 */
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../../App";
import { useMessages } from "../../../hooks/useMessages";
import { useAuth } from "../../../hooks/useAuth";
import ScreenContainer from "../../Navigation/ScreenContainer";
import {
  FsMessage,
  FsConversation,
  markConversationRead,
  sendMessage,
  MemberProfile,
  getFsConversation,
  deleteMessage,
} from "../../../types/fsMessages";
import { formatTimestamp } from "../../../utils/date";
import { useConversationMeta } from "../../../hooks/useConversationMeta";
import defaultAvatar from "../../../../assets/images/default-avatar.png";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "Conversation"> {}

/**
 * Conversation
 * Renders an individual chat and handles read receipts and message sending.
 */
const Conversation: React.FC<Props> = ({ route }) => {
  const { conversationId } = route.params;
  const { user } = useAuth();
  const [conversation, setConversation] = useState<FsConversation | null>(null);
  const meta = useConversationMeta(conversationId);
  const messages = useMessages<FsMessage>(
    `conversations/${conversationId}/messages`
  );
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList<FsMessage>>(null);
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const keyboardOffset = headerHeight || insets.top + 44;
  // Mark messages as read whenever new ones arrive
  useEffect(() => {
    if (!user) return;
    markConversationRead(
      conversationId,
      { userId: user.userId, firebaseUid: user.firebaseUid },
      messages
    );
  }, [messages, user, conversationId]);

  useEffect(() => {
    if (!user) return;
    getFsConversation(conversationId, user.userId).then(setConversation);
  }, [conversationId, user]);

  /**
   * Sends a message through the Firestore helper and resets the input.
   */
  const handleSend = async () => {
    if (!user || !newMessage.trim()) return;
    const content = newMessage.trim();
    const profiles = meta.memberProfiles || conversation?.memberProfiles || {};
    const participantEntries = Object.entries(conversation?.participants || {});
    const recipients = participantEntries
      .filter(([_, info]) => info.userId !== user.userId)
      .map(([firebaseUid, info]) => {
        const prof = profiles[String(info.userId)] as MemberProfile | undefined;
        return {
          firebaseUid,
          userId: info.userId,
          firstName: prof?.firstName,
          lastName: prof?.lastName,
          profilePicturePath: prof?.profilePicturePath,
        };
      });
    await sendMessage(
      String(conversationId),
      {
        userId: user.userId,
        firebaseUid: user.firebaseUid,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicturePath: user.profilePicturePath,
      },
      content,
      meta.type || conversation?.type || "direct",
      recipients
    );
    setNewMessage("");
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleDeleteMessage = (msg: FsMessage) => {
    const type = meta.type || conversation?.type || "direct";
    Alert.alert("Delete message?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteMessage(String(conversationId), msg.messageId, type);
        },
      },
    ]);
  };

  /**
   * Renders each message bubble with timestamp and read status.
   */
  const profiles = meta.memberProfiles || conversation?.memberProfiles || {};
  const participantIds = Object.keys(profiles).map((id) => Number(id));
  const otherIds = participantIds.filter((id) => id !== user?.userId);
  const conversationName =
    (meta.type || conversation?.type) === "group"
      ? "Group Chat"
      : `${profiles[String(otherIds[0])]?.firstName ?? ""} ${
          profiles[String(otherIds[0])]?.lastName ?? ""
        }`.trim();

  const renderItem = ({ item }: { item: FsMessage }) => {
    const incoming = item.senderId !== user?.userId;
    const participantUids = Object.keys(conversation?.participants || {});
    const otherParticipantUids = participantUids.filter(
      (uid) => conversation?.participants?.[uid].userId !== item.senderId
    );
    const isRead = incoming
      ? !!item.readBy?.[user?.firebaseUid || ""]
      : otherParticipantUids.every((uid) => item.readBy?.[uid]);
    return (
      <TouchableOpacity
        onLongPress={() => handleDeleteMessage(item)}
        style={incoming ? styles.messageRowLeft : styles.messageRowRight}
      >
        {incoming && (
          <Image
            source={
              profiles[String(item.senderId)]?.profilePicturePath
                ? { uri: profiles[String(item.senderId)].profilePicturePath }
                : defaultAvatar
            }
            style={styles.avatar}
          />
        )}
        <View style={incoming ? styles.messageLeft : styles.messageRight}>
          <Text>{item.messageContent}</Text>
          <View style={styles.meta}>
            <Text style={styles.time}>
              {formatTimestamp(item.sentTimestamp)}
            </Text>
            <Text style={styles.readStatus}>{isRead ? "Read" : "Unread"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer showBottomBar={false} showBack title={conversationName}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={keyboardOffset}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.messageId}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
        <View
          style={[styles.inputContainer, { marginBottom: insets.bottom + 4 }]}
        >
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            placeholderTextColor={"#ccc"}
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
  messageRowLeft: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginVertical: 4,
  },
  messageRowRight: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginVertical: 4,
    justifyContent: "flex-end",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageLeft: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 4,
  },
  messageRight: {
    backgroundColor: "#cfe9ff",
    padding: 8,
    borderRadius: 4,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  readStatus: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: "white",
  },
});

export default Conversation;
