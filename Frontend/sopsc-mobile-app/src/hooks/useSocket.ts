import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:3001';

export const useSocket = (userId: number | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let mounted = true;
    const connect = async () => {
      if (!userId) return;
      const token = await SecureStore.getItemAsync('token');
      if (!mounted) return;
      socketRef.current = io(WS_URL, {
        autoConnect: true,
        auth: { token },
        query: { userId: String(userId) },
      });
    };
    connect();
    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  return socketRef;
};
export default useSocket;