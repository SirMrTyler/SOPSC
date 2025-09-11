// App.tsx
// ngrok http https://localhost:5001

// Libraries
import React, { useState, useEffect } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  LinkingOptions,
  createNavigationContainerRef,
} from "@react-navigation/native";
import * as Linking from "expo-linking";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ImageBackground, StyleSheet, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

// Components
import Login from "./src/components/User/Login";
import Register from "./src/components/User/Register";
import LandingPage from "./src/components/Landing/LandingPage";
import Messages from "./src/components/Messaging/Inbox";
import UserList from "./src/components/Messaging/UserList";
import CreateGroupMessage from "./src/components/Messaging/Groups/GroupMessageCreate";
import GroupInbox from "./src/components/Messaging/Groups/GroupInbox";
import RenderGroupMessage from "./src/components/Messaging/Groups/RenderGroupMessage";
import AddGroupChatMembers from "./src/components/Messaging/Groups/GroupMessageAddMember";
import Conversation from "./src/components/Messaging/Messages/RenderMessage";
import AdminDashboard from "./src/components/Admin/AdminDashboard"; // TODO: Make AdminDashboard Component
import PrayerRequests from "./src/components/Posts/Post"; // TODO: Make Prayer Requests component logic
import Reports from "./src/components/Reports/Reports"; // TODO: Make Reports component logic
import ReportDetails from "./src/components/Reports/ReportDetails";
import Schedule from "./src/components/Schedule/Schedule";
import Profile from "./src/components/Profile/Profile"; // TODO: Make Profile component logic
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Posts from "./src/components/Posts/Post";
import { usePushNotifications } from "./src/hooks/usePushNotifications";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { consumePendingUrl } from "./src/navigation/intentQueue";
import { installNotificationTapHandling } from "./src/navigation/handleTaps";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Landing: { user: any } | undefined;
  Messages: undefined;
  UserList: undefined;
  CreateGroupChat: undefined;
  GroupChats: undefined;
  GroupChatConversation: { chatId: string; name: string };
  AddGroupChatMembers: { chatId: string };
  Conversation: { conversationId: string };
  Chat: { conversationId: string };
  AdminDashboard: undefined; // Assuming you have an AdminDashboard screen
  Posts: undefined;
  Reports: undefined;
  ReportDetails: { reportId: number };
  Schedule: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationRef = createNavigationContainerRef<RootStackParamList>();

const backgroundImage = require("./assets/images/backgroundImage.png");

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent", // Set background to transparent for the ImageBackground
  },
};

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/"), "sopsc://", "https://sopsc.app"],
  config: {
    screens: {
      Chat: "chat/:conversationId",
      Login: "login",
      Register: "register",
      Landing: "landing",
      Messages: "messages",
    },
  },
  async getInitialURL(): Promise<string | null> {
    const url = await Linking.getInitialURL();
    if (url) return url;
    return consumePendingUrl();
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);
    const urlSub = Linking.addEventListener("url", onReceiveURL);
    const notificationSub = installNotificationTapHandling();
    return () => {
      urlSub.remove();
      notificationSub.remove();
    };
  },
};

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [navReady, setNavReady] = useState(false);

  const handleNotificationTap = ({
    url,
    conversationId,
  }: {
    url?: string;
    conversationId?: string;
  }) => {
    if (url) {
      Linking.openURL(url);
    } else if (conversationId) {
      navigationRef.navigate("Conversation", { conversationId });
    }
  };

  usePushNotifications(user, handleNotificationTap);

  useEffect(() => {
    if (!navReady) return;
    const url = consumePendingUrl();
    if (url) {
      Linking.openURL(url);
    }
  }, [navReady]);

  return (
    <SafeAreaProvider>
      <AppNavigator
        user={user}
        setUser={setUser}
        onReady={() => setNavReady(true)}
      />
    </SafeAreaProvider>
  );
}

function AppNavigator({
  user,
  setUser,
  onReady,
}: {
  user: any | null;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
  onReady: () => void;
}) {
  return (
    <ErrorBoundary>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#2477ff" }}
        edges={["top"]}
      >
        <NavigationContainer
          theme={AppTheme}
          linking={linking}
          ref={navigationRef}
          onReady={onReady}
        >
          <StatusBar
            style={Platform.OS === "android" ? "dark" : "light"}
            backgroundColor={Platform.OS === "android" ? "#2477ff" : undefined}
            translucent={false}
          />
          <ImageBackground
            source={backgroundImage}
            style={styles.background}
            imageStyle={{ resizeMode: "cover" }}
          >
            <Stack.Navigator
              id={undefined}
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
              }}
            >
              {user ? (
                <>
                  <Stack.Screen name="Landing">
                    {(props) => (
                      <LandingPage
                        {...props}
                        onLogout={() => setUser(null)}
                        user={user}
                      />
                    )}
                  </Stack.Screen>

                  <Stack.Screen name="Messages" component={Messages} />
                  <Stack.Screen name="UserList" component={UserList} />
                  <Stack.Screen name="GroupChats" component={GroupInbox} />
                  <Stack.Screen
                    name="CreateGroupChat"
                    component={CreateGroupMessage}
                  />
                  <Stack.Screen
                    name="GroupChatConversation"
                    component={RenderGroupMessage}
                  />
                  <Stack.Screen
                    name="AddGroupChatMembers"
                    component={AddGroupChatMembers}
                  />
                  <Stack.Screen name="Conversation" component={Conversation} />
                  <Stack.Screen name="Chat" component={Conversation} />
                  <Stack.Screen
                    name="AdminDashboard"
                    component={AdminDashboard}
                  />
                  <Stack.Screen name="Posts" component={Posts} />
                  <Stack.Screen name="Reports" component={Reports} />
                  <Stack.Screen
                    name="ReportDetails"
                    component={ReportDetails}
                  />
                  <Stack.Screen name="Schedule" component={Schedule} />
                  <Stack.Screen name="Profile" component={Profile} />
                  {/* Add other screens here as needed */}
                </>
              ) : (
                <>
                  <Stack.Screen name="Login">
                    {(props) => (
                      <Login
                        {...props}
                        onLoginSuccess={(userData: any) => setUser(userData)}
                      />
                    )}
                  </Stack.Screen>
                  <Stack.Screen name="Register">
                    {(props) => (
                      <Register
                        {...props}
                        onRegisterSuccess={(userData: any) => setUser(userData)}
                      />
                    )}
                  </Stack.Screen>
                </>
              )}
            </Stack.Navigator>
          </ImageBackground>
        </NavigationContainer>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
