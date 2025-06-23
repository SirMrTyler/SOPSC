// App.tsx
import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function App() {
  // Define usable variables
  const connectionAddress = 'https://afe4-137-119-8-154.ngrok-free.app/api/';


  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '203699688611-22395m5an9cgtfldgrmvvfok5uk21dva.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In result:', userInfo);

      // Uncomment the line below to see the full user info in console
      // This can be useful for debugging purposes, but be cautious with sensitive data.
      // console.log('User Info:', userInfo);

      console.log('\n(Line 32): ID From Google:', userInfo.data.user.id);

      const name = userInfo.data.user.name + userInfo.data.user.givenName;
      alert(`Welcome ${name}! You have successfully signed in with Google.`);

      // Send userInfo to backend
      try {
        const response = await fetch(`${connectionAddress}users/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: userInfo.data.idToken
          })
        });
        console.log('idToken value:', userInfo.data.idToken);
        if (response.ok) {
          const data = await response.json();
          console.log('Google Sign-In success:', data);
          alert(`Signed in! Token: ${data.item.token}`);
        } else {
          console.error('Google sign-in failed:', response.status);
          const err = await response.text();
          alert(`Google sign-in failed: ${err}`);
        }
      } catch (error) {
        console.log(`Error sending Google sign-in to API:`, error);
        alert(`Google sign-in failed: ${error}`);
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Google Play Services not available');
      } else {
        alert(`Unknown error: ${JSON.stringify(error)}`);
      }
    }
  };

    return (
    <View style={styles.container}>
      <Text style={styles.title}>SOPSC Google Sign-In Demo</Text>
      <Button title="Sign In with Google" onPress={signIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
