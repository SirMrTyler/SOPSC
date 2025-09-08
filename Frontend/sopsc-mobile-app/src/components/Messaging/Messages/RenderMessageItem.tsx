/**
 * File: RenderMessageItem.tsx
 * Purpose: Renders a preview row for a conversation in the inbox list.
 * Notes: Shows read status and timestamp for the latest message.
 */
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import type { FsConversation } from "../../../types/fsMessages";
import { formatTimestamp } from "../../../utils/date";
import defaultAvatar from "../../../../assets/images/default-avatar.png";
import { useAuth } from "../../../hooks/useAuth";
import { getById } from "../../User/services/userService";
interface Props {
  conversation: FsConversation;
  onPress: () => void;
  onLongPress?: () => void;
}

/**
 * ConversationItem
 * Displays conversation metadata including read status and timestamp.
 */
const ConversationItem: React.FC<Props> = ({
  conversation,
  onPress,
  onLongPress,
}) => {
  const { user } = useAuth();
  const profiles = conversation.memberProfiles || {};
  const others = Object.entries(profiles).filter(
    ([id]) => Number(id) !== user?.userId
  );
  const nameFromProfiles = `${others[0]?.[1]?.firstName ?? ""} ${
    others[0]?.[1]?.lastName ?? ""
  }`.trim();
  const fallbackDirectName = React.useMemo(() => {
    if (nameFromProfiles) return nameFromProfiles;
    const other = Object.values(conversation.participants || {})
      .map((p: any) => p.userId)
      .find((id: number) => id !== user?.userId);
    const prof = other ? profiles[String(other)] : undefined;
    return prof ? `${prof.firstName} ${prof.lastName}`.trim() : "";
  }, [conversation, profiles, user, nameFromProfiles]);

  const [resolvedName, setResolvedName] = useState(
    nameFromProfiles || fallbackDirectName
  );

  useEffect(() => {
    const loadProfile = async () => {
      if (nameFromProfiles || fallbackDirectName || conversation.type === "group") {
        setResolvedName(nameFromProfiles || fallbackDirectName);
        return;
      }
      const other = Object.values(conversation.participants || {})
        .map((p: any) => p.userId)
        .find((id: number) => id !== user?.userId);
      if (other) {
        try {
          const res = await getById(other);
          const prof = res?.item;
          if (prof) {
            conversation.memberProfiles = {
              ...(conversation.memberProfiles || {}),
              [other]: prof,
            };
            setResolvedName(`${prof.firstName} ${prof.lastName}`.trim());
          }
        } catch (err) {
          console.error("[RenderMessageItem] Failed to fetch user profile", err);
        }
      }
    };
    loadProfile();
  }, [conversation, nameFromProfiles, fallbackDirectName, user]);

  const displayName =
    conversation.type === "group" ? "Group Chat" : resolvedName || "Member";
  const avatarPath =
    conversation.type === "group"
      ? undefined
      : others[0]?.[1]?.profilePicturePath;
  const unread = conversation.unreadCount?.[user?.firebaseUid || ""] || 0;
  const time = formatTimestamp(conversation.sentTimestamp, {
    includeDay: true,
    includeDate: true,
    includeTime: true,
  });
  const isReadByAll = React.useMemo(() => {
    if (!user) return false;
    if (conversation.lastSenderId !== user.userId) return false;
    const readBy = conversation.lastMessageReadBy || {};
    const participantUids = Object.keys(conversation.participants || {});
    return participantUids
      .filter((uid) => uid !== user.firebaseUid)
      .every((uid) => readBy[uid]);
  }, [conversation, user]);
  return (
    <View style={styles.messageBox}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <Image
          source={avatarPath ? { uri: avatarPath } : defaultAvatar}
          style={styles.avatar}
        />
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
              {conversation.mostRecentMessage}
            </Text>
            {conversation.lastSenderId === user?.userId && (
              <Text style={styles.readStatus}>
                {isReadByAll ? "Read" : "Unread"}
              </Text>
            )}
          </View>
        </View>
        {unread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBox: {
    backgroundColor: "rgba(255, 255, 255, .05)",
    borderRadius: 12,
    padding: 6,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, .07)",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    color: "white",
  },
  message: {
    color: "#DED3C4",
  },
  time: {
    color: "#DED3C4",
    fontSize: 12,
  },
  badge: {
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: "absolute",
    bottom: 8,
    right: 13,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  readStatus: {
    marginLeft: 6,
    fontSize: 12,
    color: "#DED3C4",
  },
});

export default ConversationItem;
