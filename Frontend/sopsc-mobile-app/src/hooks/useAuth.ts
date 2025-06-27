import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { autoLogin, login as emailLogin, googleLogin, logout } from '../services/userService.js';

export interface AuthUser {
  name?: string;
  email?: string;
  [key: string]: any;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryAutoLogin = async () => {
      const deviceId = await SecureStore.getItemAsync('deviceId');
      if (deviceId) {
        try {
          const data = await autoLogin(deviceId);
          await SecureStore.setItemAsync('token', String(data.item.token));
          setUser(data.item.user);
        } catch {
          await SecureStore.deleteItemAsync('token');
        }
      }
      setLoading(false);
    };
    tryAutoLogin();
  }, []);

  const signInEmail = async (email: string, password: string) => {
    let deviceId = await SecureStore.getItemAsync('deviceId');
    if (!deviceId) {
      deviceId = Crypto.randomUUID();
      await SecureStore.setItemAsync('deviceId', deviceId);
    }
    const data = await emailLogin(email, password);
    await SecureStore.setItemAsync('token', String(data.item.token));
    await SecureStore.setItemAsync('deviceId', String(data.item.deviceId));
    setUser({ email });
  };

  const signInGoogle = async (idToken, name?, email?) => {
    const data = await googleLogin(idToken);
    await SecureStore.setItemAsync('token', String(data.token));
    await SecureStore.setItemAsync('deviceId', String(data.deviceId));
    setUser({ name, email });
  };

  const signOut = async () => {
    const token = await SecureStore.getItemAsync('token');
    const deviceId = await SecureStore.getItemAsync('deviceId');
    if (token && deviceId) {
      await logout(token, deviceId);
    }
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('deviceId');
    setUser(null);
  };
  
  return { user, loading, signInEmail, signInGoogle, signOut };
};
