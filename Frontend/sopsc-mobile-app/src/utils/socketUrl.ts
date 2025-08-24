import Constants from 'expo-constants';

/**
 * Returns the socket server URL from Expo config or environment variables.
 * Strips any trailing slash to avoid duplicate path issues.
 */
export function getSocketUrl(): string {
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, any>;
  const url =
    typeof extra.EXPO_PUBLIC_SOCKET_URL === 'string'
      ? extra.EXPO_PUBLIC_SOCKET_URL
      : process.env.EXPO_PUBLIC_SOCKET_URL || 'http://192.168.1.175:3001';

  return url.replace(/\/$/, '');
}
