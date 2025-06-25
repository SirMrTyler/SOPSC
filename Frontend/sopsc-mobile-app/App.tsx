// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import SignIn from './src/components/SignIn';
import { API_URL } from './src/config';
import { getCredentials, clearCredentials } from './src/utils/auth';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const { token, deviceId } = await getCredentials();
      if (token && deviceId) {
        try {
          const response = await fetch(`${API_URL}users/current`, {
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

  const logOut = async () => {
    const { token, deviceId } = await getCredentials();
    if (token && deviceId) {
      try {
        await fetch(`${API_URL}users/logout`, {
          headers: { Authorization: `Bearer ${token}`, DeviceId: deviceId },
        });
      } catch (err) {
        console.log('Logout request failed', err);
      }
    }
    await clearCredentials();
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

  return <SignIn onSignedIn={setUser} />;
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
