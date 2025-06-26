// App.tsx
// ngrok http https://localhost:5001
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from './components/Login';
import LandingPage from './components/LandingPage';

export type RootStackParamList = {
  Auth: undefined;
  Landing: { user: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Landing" component={LandingPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}