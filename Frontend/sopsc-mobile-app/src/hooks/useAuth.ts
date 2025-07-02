import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { autoLogin, login as emailLogin, getCurrent, googleLogin, logout } from '../services/userService.js';

export interface AuthUser {
  userId: number;
  name: {
    firstName: string;
    lastName: string;
  }
  email: string;
  Roles: [{ roleId: number; roleName: string }, ...any[]]; // Adjusted to allow for multiple roles
  profilePicturePath?: string;
  isConfirmed: boolean;
  isActive: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[useAuth] User:", user)
  }, [user]);
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
    try {
      const data = await emailLogin(email, password, deviceId);
      const token = String(data.item.token);

      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('deviceId', String(data.item.deviceId));

      const currentUser = await getCurrent(token, String(data.item.deviceId));
      setUser(currentUser.item);
    } catch (error) {
      console.error('Email login error:', error);
      alert('Email login failed. Please try again.');
      return error;
    }
  };

  const signInGoogle = async (idToken, name, email) => {
    const data = await googleLogin(idToken);
    const token = String(data.item.token);
    const deviceId = String(data.item.deviceId);

    // Store the token and deviceId securely
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('deviceId', deviceId);

    const currentUser = await getCurrent(token, deviceId);
    setUser(currentUser.item);
    // setUser({
    //   userId: 0,
    //   name: name,
    //   email: email,
    //   Roles: [{ roleId: 0, roleName: 'User' }],
    //   isConfirmed: false,
    //   isActive: false,
    // });
    console.log("[useAuth] User:", { user });
  };

  const signOut = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const deviceId = await SecureStore.getItemAsync('deviceId');
      if (token && deviceId) {
        try {
          await logout(token, deviceId);
        } catch {
          // ignore network failures so local sign-out still succeeds
        }
      }
    } finally {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('deviceId');
      setUser(null);
    }
  };

  return { user, loading, signInEmail, signInGoogle, signOut };
};
