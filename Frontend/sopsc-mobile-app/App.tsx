// App.tsx
// ngrok http https://localhost:5001

// Libraries
import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImageBackground, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Components
import Login from './src/components/user/Login';
import Register from './src/components/user/Register';
import LandingPage from './src/components/landing/LandingPage';
import Messages from './src/components/messages/Messages';
import UserList from './src/components/messages/UserList';
import CreateGroupChat from './src/components/messages/CreateGroupChat';
import GroupChats from './src/components/messages/GroupChats';
import GroupChatConversation from './src/components/messages/GroupChatConversation';
import AddGroupChatMembers from './src/components/messages/AddGroupChatMembers';
import Conversation from './src/components/messages/Conversation';
import { MessageConversation } from './src/types/messages';
import AdminDashboard from './src/components/admin/AdminDashboard'; // TODO: Make AdminDashboard Component
import PrayerRequests from './src/components/posts/Post'; // TODO: Make Prayer Requests component logic
import Reports from './src/components/reports/Reports'; // TODO: Make Reports component logic
import ReportDetails from './src/components/reports/ReportDetails';
import ReportForm from './src/components/reports/ReportForm';
import Schedule from './src/components/schedule/Schedule';
import Profile from './src/components/profile/Profile'; // TODO: Make Profile component logic
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SocketProvider } from './src/hooks/SocketContext';
import Posts from './src/components/posts/Post';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Landing: { user: any} | undefined;
  Messages: undefined;
  UserList: undefined;
  CreateGroupChat: undefined;
  GroupChats: undefined;
  GroupChatConversation: { chatId: number; name: string };
  AddGroupChatMembers: { chatId: number };
  Conversation: { conversation: MessageConversation };
  AdminDashboard: undefined; // Assuming you have an AdminDashboard screen
  Posts: undefined;
  Reports: undefined;
  ReportDetails: { id: number };
  ReportForm: undefined;
  Schedule: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const backgroundImage = require('./assets/images/backgroundImage.png');

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent', // Set background to transparent for the ImageBackground
  },
};

export default function App() {
  const [user, setUser] = useState<any | null>(null);

  return (
    <SafeAreaProvider>
      <SocketProvider user={user}>
        <NavigationContainer theme={AppTheme}>
          <StatusBar style="light" translucent={false} />
          <ImageBackground source={backgroundImage} style={styles.background} imageStyle={{ resizeMode: 'cover' }}>
            <Stack.Navigator
              id={undefined}
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
              }}>
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
                  <Stack.Screen name="GroupChats" component={GroupChats} />
                  <Stack.Screen name="CreateGroupChat" component={CreateGroupChat} />
                  <Stack.Screen name="GroupChatConversation" component={GroupChatConversation} />
                  <Stack.Screen name="AddGroupChatMembers" component={AddGroupChatMembers} />
                  <Stack.Screen name="Conversation" component={Conversation} />
                  <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
                  <Stack.Screen name="Posts" component={Posts} />
                  <Stack.Screen name="Reports" component={Reports} />
                  <Stack.Screen name="ReportDetails" component={ReportDetails} />
                  <Stack.Screen name="ReportForm" component={ReportForm} />
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
      </SocketProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});