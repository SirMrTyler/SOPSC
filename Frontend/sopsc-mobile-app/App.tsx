// App.tsx
// ngrok http https://localhost:5001

// Libraries
import React, { useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ImageBackground, StyleSheet } from "react-native";
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
import { FsConversationNav } from "./src/types/fsMessages";
import AdminDashboard from "./src/components/Admin/AdminDashboard"; // TODO: Make AdminDashboard Component
import PrayerRequests from "./src/components/Posts/Post"; // TODO: Make Prayer Requests component logic
import Reports from "./src/components/Reports/Reports"; // TODO: Make Reports component logic
import ReportDetails from "./src/components/Reports/ReportDetails";
import Schedule from "./src/components/Schedule/Schedule";
import Profile from "./src/components/Profile/Profile"; // TODO: Make Profile component logic
import { SafeAreaProvider } from "react-native-safe-area-context";
import Posts from "./src/components/Posts/Post";
import { usePushNotifications } from "./src/hooks/usePushNotifications";

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
  Conversation: { conversation: FsConversationNav };
  AdminDashboard: undefined; // Assuming you have an AdminDashboard screen
  Posts: undefined;
  Reports: undefined;
  ReportDetails: { reportId: number };
  Schedule: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const backgroundImage = require("./assets/images/backgroundImage.png");

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent", // Set background to transparent for the ImageBackground
  },
};

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  usePushNotifications(user);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={AppTheme}>
        <StatusBar style="light" translucent={false} />
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
                <Stack.Screen
                  name="AdminDashboard"
                  component={AdminDashboard}
                />
                <Stack.Screen name="Posts" component={Posts} />
                <Stack.Screen name="Reports" component={Reports} />
                <Stack.Screen name="ReportDetails" component={ReportDetails} />
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
