import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export async function saveCredentials(token: string, deviceId: string) {
  await SecureStore.setItemAsync('token', token);
  await SecureStore.setItemAsync('deviceId', deviceId);
}

export async function getCredentials() {
  const token = await SecureStore.getItemAsync('token');
  const deviceId = await SecureStore.getItemAsync('deviceId');
  return { token, deviceId };
}

export async function ensureDeviceId(): Promise<string> {
  let deviceId = await SecureStore.getItemAsync('deviceId');
  if (!deviceId) {
    deviceId = Crypto.randomUUID();
    await SecureStore.setItemAsync('deviceId', deviceId);
  }
  return deviceId;
}

export async function clearCredentials() {
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('deviceId');
}
