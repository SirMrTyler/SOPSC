// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Import Componenets
import LandingPage from './LandingPage';

const AuthScreen = () => {
  // Define usable variables
  // Read API base URL from environment variable. Expo automatically exposes
  const connectionAddress = process.env.EXPO_PUBLIC_API_URL || '';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });

    const checkToken = async () => {
      const deviceId = await SecureStore.getItemAsync('deviceId');
      if (deviceId) {
        try {
          const response = await fetch(`${connectionAddress}users/auto-login`, {
            headers: { DeviceId: deviceId },
          });
          if (response.ok) {
            const data = await response.json();
            await SecureStore.setItemAsync('token', String(data.item.token));
            setUser(data.item.user);
          } else if (response.status === 401) {
            await SecureStore.deleteItemAsync('token');
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
      const userInfo: any = await GoogleSignin.signIn();

      const name = (userInfo.data?.user?.name ?? '') + (userInfo.data?.user?.givenName ?? '');

      try {
        const response = await fetch(`${connectionAddress}users/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: userInfo.data?.idToken,
          }),
        });
        console.log('Response Value:', userInfo.data);
        if (response.ok) {
          const data = await response.json();
          await SecureStore.setItemAsync('token', String(data.token));
          await SecureStore.setItemAsync('deviceId', String(data.deviceId));
          setUser({ name: userInfo.user?.name, email: userInfo.user?.email });
        } else {
          const err = await response.text();
          alert(`Google sign-in failed: ${err}`);
        }
      } catch (error) {
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
    return <LandingPage user={user} onLogout={logOut} />;
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
};

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

export default AuthScreen;