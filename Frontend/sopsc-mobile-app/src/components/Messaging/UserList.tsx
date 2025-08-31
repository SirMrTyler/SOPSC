/**
 * File: UserList.tsx
 * Purpose: Presents a searchable list of users and navigates to a conversation with the selected user.
 * Notes: Creates a new conversation document if one does not already exist.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";
import { getAll } from "../User/services/userService";
import { useAuth } from "../../hooks/useAuth";
import { UserResult } from "../../types/user";
import ScreenContainer from "../Navigation/ScreenContainer";
import { getApp } from "@react-native-firebase/app";
import {
  getFirestore,
  collection,
  query as fsQuery,
  where,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "@react-native-firebase/firestore";
import defaultAvatar from "../../../assets/images/default-avatar.png";

const db = getFirestore(getApp());

/**
 * UserList
 * Enables searching for other users and starting or resuming conversations.
 */
const UserList: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserResult[]>([]);
  const [results, setResults] = useState<UserResult[]>([]);

  // Load all users, refetching when auth info changes
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await getAll(0, 200);
        const fetched = data?.item?.pagedItems || [];
        const filtered = fetched.filter((u) => u.userId !== user?.userId);
        setUsers(filtered);
        setResults(filtered);
      } catch (err: any) {
        const sCode = err.response?.status;
        console.log("[UserList] sCode: ", sCode);
        setUsers([]);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [user]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const q = query.trim().toLowerCase();
      if (q) {
        setResults(
          users.filter((u) =>
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
          )
        );
      } else {
        setResults(users);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, users]);

  /**
   * Navigates to an existing conversation or creates one if none is found.
   * @param u User selected from the list
   */
  const handleUserPress = async (u: UserResult) => {
    if (!user) return;
    try {
      const convRef = collection(db, "conversations");
      const q = fsQuery(
        convRef,
        where(`participants.${user.firebaseUid}.userId`, "==", user.userId),
        where(`participants.${u.firebaseUid}.userId`, "==", u.userId)
      );
      const snapshot = await getDocs(q);
      let chatId: string;
      let sentTimestamp: string | null = null;
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        chatId = doc.id;
        const data: any = doc.data();
        const ts = data.sentTimestamp?.toDate?.();
        sentTimestamp = ts ? ts.toISOString() : null;
      } else {
        const docRef = await addDoc(convRef, {
          participants: {
            [user.firebaseUid]: { userId: user.userId },
            [u.firebaseUid]: { userId: u.userId },
          },
          memberProfiles: {
            [user.userId]: {
              firstName: user.firstName,
              lastName: user.lastName,
              profilePicturePath: user.profilePicturePath || "",
            },
            [u.userId]: {
              firstName: u.firstName,
              lastName: u.lastName,
              profilePicturePath: u.profilePicturePath || "",
            },
          },
          unreadCount: { [user.firebaseUid]: 0, [u.firebaseUid]: 0 },
          mostRecentMessage: "",
          numMessages: 0,
          sentTimestamp: serverTimestamp(),
          type: "direct",
        });
        await updateDoc(docRef, { chatId: docRef.id });
        chatId = docRef.id;
      }
      navigation.navigate("Conversation", {
        conversation: {
          chatId: chatId,
          mostRecentMessage: "",
          sentTimestamp: sentTimestamp,
          numMessages: 0,
          participants: {
            [user.firebaseUid]: { userId: user.userId },
            [u.firebaseUid]: { userId: u.userId },
          },
          memberProfiles: {
            [user.userId]: {
              firstName: user.firstName,
              lastName: user.lastName,
              profilePicturePath: user.profilePicturePath || "",
            },
            [u.userId]: {
              firstName: u.firstName,
              lastName: u.lastName,
              profilePicturePath: u.profilePicturePath || "",
            },
          },
          unreadCount: { [user.firebaseUid]: 0, [u.firebaseUid]: 0 },
          type: "direct",
          otherUserId: u.userId,
          otherUserName: `${u.firstName} ${u.lastName}`,
          otherUserProfilePicturePath: u.profilePicturePath || "",
        },
      });
    } catch (err) {
      console.log("[UserList] error navigating to conversation", err);
    }
  };

  return (
    <ScreenContainer showBack title="Messages">
      <View style={styles.container}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor={"#DED3C4"}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.userId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleUserPress(item)}
              >
                <Image
                  source={
                    item.profilePicturePath
                      ? { uri: item.profilePicturePath }
                      : defaultAvatar
                  }
                  style={styles.avatar}
                />
                <Text style={styles.name}>
                  {item.firstName} {item.lastName}
                </Text>
              </TouchableOpacity>
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#555",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  name: {
    color: "white",
  },
});

export default UserList;
