// App.tsx
// ngrok http https://localhost:5001

// Libraries
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components
import Login from './src/components/user/Login';
import LandingPage from './src/components/landing/LandingPage';
import Messages from './src/components/messages/Messages';

export type RootStackParamList = {
  Login: undefined;
  Landing: { user: any} | undefined;
  Messages: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<any | null>(null);

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined}screenOptions={{ headerShown: false }}>
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
            
            {/* Add other screens here as needed */}
            <Stack.Screen name="Messages" component={Messages} />
            
          </>
        ) : (
          <Stack.Screen name="Login">
            {(props) => (
              <Login
                {...props}
                onLoginSuccess={(userData: any) => setUser(userData)}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}