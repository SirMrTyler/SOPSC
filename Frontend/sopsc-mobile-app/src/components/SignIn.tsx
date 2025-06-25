import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { API_URL } from '../config';
import { saveCredentials, ensureDeviceId } from '../utils/auth';

interface Props {
  onSignedIn: (user: { name?: string; email?: string }) => void;
}

export default function SignIn({ onSignedIn }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '203699688611-22395m5an9cgtfldgrmvvfok5uk21dva.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      try {
        const response = await fetch(`${API_URL}users/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: userInfo.data.idToken }),
        });
        if (response.ok) {
          const data = await response.json();
          await saveCredentials(String(data.token), String(data.deviceId));
          onSignedIn({ name: data.name, email: data.email });
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
      const deviceId = await ensureDeviceId();
      const response = await fetch(`${API_URL}users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', DeviceId: deviceId },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        await saveCredentials(String(data.item.token), String(data.item.deviceId));
        onSignedIn({ email });
      } else {
        const err = await response.text();
        alert(`Login failed: ${err}`);
      }
    } catch (error) {
      alert(`Login failed: ${error}`);
    }
  };

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
