// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function App() {
  // Define usable variables
  const connectionAddress = 'https://2c87-137-119-8-154.ngrok-free.app/api/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '203699688611-22395m5an9cgtfldgrmvvfok5uk21dva.apps.googleusercontent.com',
      offlineAccess: true,
    });

    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      const deviceId = await SecureStore.getItemAsync('deviceId');
      if (token && deviceId) {
        try {
          const response = await fetch(`${connectionAddress}users/current`, {
            headers: {
              Authorization: `Bearer ${token}`,
              DeviceId: deviceId,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.item);
          }
        } catch (e) {
          console.log('Auto-login failed', e);
        }
      }
      setLoading(false);
    };

    checkToken();
  }, []);
const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // Uncomment the line below to see the full user info in console
      // This can be useful for debugging purposes, but be cautious with sensitive data.
      // console.log('User Info:', userInfo);

      const name = userInfo.data.user.name + userInfo.data.user.givenName;

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
        await SecureStore.setItemAsync('token', String(data.token));
        await SecureStore.setItemAsync('deviceId', String(data.deviceId));
          setUser({ name: data.name, email: data.email });
        } else {
          //console.error('Google sign-in failed:', response.status);
          const err = await response.text();
          alert(`Google sign-in failed: ${err}`);
        }
      } catch (error) {
        //console.log(`Error sending Google sign-in to API:`, error);
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

  const emailSignIn = async () => {
    try {
      let deviceId = await SecureStore.getItemAsync('deviceId');
      if (!deviceId) {
        deviceId = Crypto.randomUUID();
        await SecureStore.setItemAsync('deviceId', deviceId);
      }

      const response = await fetch(`${connectionAddress}users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          DeviceId: deviceId,
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await SecureStore.setItemAsync('token', String(data.item.token));
        await SecureStore.setItemAsync('deviceId', String(data.item.deviceId));
        setUser({ email });
      } else {
        const err = await response.text();
        alert(`Login failed: ${err}`);
      }
    } catch (error) {
      alert(`Login failed: ${error}`);
    }
  };

  const logOut = async () => {
    const token = await SecureStore.getItemAsync('token');
    const deviceId = await SecureStore.getItemAsync('deviceId');
    if (token && deviceId) {
      try {
        await fetch(`${connectionAddress}users/logout`, {
          headers: { Authorization: `Bearer ${token}`, DeviceId: deviceId },
        });
      } catch (err) {
        console.log('Logout request failed', err);
      }
    }
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('deviceId');
    setUser(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome {user.name || user.email}</Text>
        <Button title="Log Out" onPress={logOut} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <Text style={styles.title}>SOPSC Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={emailSignIn} />
      <View style={{ height: 10 }} />
      <Button title="Sign In with Google" onPress={googleSignIn} />
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
  input: {
    width: '80%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
});