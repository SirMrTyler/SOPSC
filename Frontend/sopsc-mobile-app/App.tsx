// App.tsx
// ngrok http https://localhost:5001

// Libraries
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImageBackground, StyleSheet } from 'react-native';

// Components
import Login from './src/components/user/Login';
import Register from './src/components/user/Register';
import LandingPage from './src/components/landing/LandingPage';
import Messages from './src/components/messages/Messages';
import Conversation from './src/components/messages/Conversation';
import { MessageConversation } from './src/types/messages';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Landing: { user: any} | undefined;
  Messages: undefined;
  Conversation: { conversation: MessageConversation };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const backgroundImage = require('./assets/images/backgroundImage.png');

export default function App() {
  const [user, setUser] = useState<any | null>(null);

  return (
    <NavigationContainer>
      <ImageBackground source={backgroundImage} style={styles.background}>
        <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
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
              <Stack.Screen name="Conversation" component={Conversation} />
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
              <Stack.Screen name="Register" component={Register} />
            </>
          )}
        </Stack.Navigator>
      </ImageBackground>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});