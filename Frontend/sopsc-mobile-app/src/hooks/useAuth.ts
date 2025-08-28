import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { autoLogin, login as emailLogin, getCurrent, googleLogin, logout } from '../components/User/services/userService.js';
import auth, { signInWithCredential, GoogleAuthProvider } from '@react-native-firebase/auth';

export interface AuthUser {
  userId: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  roleId?: number;
  roleName?: string;
  Roles: Array<{ roleId: number; roleName: string }>; // Allow for multiple roles
  profilePicturePath?: string;
  isConfirmed: boolean;
  isActive: boolean;
  divisionId?: number;
  firebaseUid: string;
}

const mapUser = (u: any): AuthUser => ({
  userId: u.userId,
  firstName: u.firstName ?? '',
  lastName: u.lastName ?? '',
  phone: u.phone,
  email: u.email,
  roleId:
    u.roleId ?? u.RoleId ?? u.Roles?.[0]?.roleId ?? u.roles?.[0]?.roleId,
  roleName:
    u.roleName ?? u.RoleName ?? u.Roles?.[0]?.roleName ?? u.roles?.[0]?.roleName,
  Roles:
    u.Roles ??
    u.roles ??
    (u.roleId || u.RoleId
      ? [{ roleId: u.roleId ?? u.RoleId, roleName: u.roleName ?? u.RoleName }]
      : []),
  profilePicturePath: u.profilePicturePath,
  isConfirmed: u.isConfirmed,
  isActive: u.isActive,
  divisionId: u.divisionId,
  firebaseUid: u.firebaseUid ?? u.FirebaseUid ?? '',
});

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
          if (data.item.user?.firebaseUid) {
            await SecureStore.setItemAsync('firebaseUid', String(data.item.user.firebaseUid));
          }
          setUser(mapUser(data.item.user));
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
      let fbUser;
      try {
        fbUser = await auth().signInWithEmailAndPassword(email, password);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
          fbUser = await auth().createUserWithEmailAndPassword(email, password);
        } else {
          throw err;
        }
      }
      const firebaseUid = fbUser.user.uid;
      const data = await emailLogin(email, password, deviceId, firebaseUid);
      const token = String(data.item.token);

      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('deviceId', String(data.item.deviceId));
      await SecureStore.setItemAsync('firebaseUid', firebaseUid);

      const currentUser = await getCurrent(token, String(data.item.deviceId));
      if (currentUser.item?.firebaseUid) {
        await SecureStore.setItemAsync('firebaseUid', currentUser.item.firebaseUid);
      }
      setUser(mapUser(currentUser.item));
    } catch (error: any) {
      console.error('Email login error:', error);
      const message =
        error?.response?.data?.errors?.[0] ?? 'Email login failed. Please try again.';
      Alert.alert('Login failed', message);
      await auth().signOut();
      return error;
    }
  };

  const signInGoogle = async (idToken: string) => {
    const credential = GoogleAuthProvider.credential(idToken);
    const fbUser = await signInWithCredential(auth(), credential);
    const firebaseUid = fbUser.user.uid;
    const data = await googleLogin(idToken, firebaseUid);
    const token = String(data.item.token);
    const deviceId = String(data.item.deviceId);

    // Store the token, deviceId, and firebaseUid securely
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('deviceId', deviceId);
    await SecureStore.setItemAsync('firebaseUid', firebaseUid);

    const currentUser = await getCurrent(token, deviceId);
    if (currentUser.item?.firebaseUid) {
      await SecureStore.setItemAsync('firebaseUid', currentUser.item.firebaseUid);
    }
    setUser(mapUser(currentUser.item));
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
      await auth().signOut();
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('deviceId');
      await SecureStore.deleteItemAsync('firebaseUid');
      setUser(null);
    }
  };

  const refresh = async () => {
    const token = await SecureStore.getItemAsync('token');
    const deviceId = await SecureStore.getItemAsync('deviceId');
    if (token && deviceId) {
      const currentUser = await getCurrent(token, deviceId);
      if (currentUser.item?.firebaseUid) {
        await SecureStore.setItemAsync('firebaseUid', currentUser.item.firebaseUid);
      }
      setUser(mapUser(currentUser.item));
    }
  };

  return { user, loading, signInEmail, signInGoogle, signOut, refresh };
};
