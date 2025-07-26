import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthUser } from './useAuth';

export const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  user: AuthUser | null;
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ user, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://192.168.1.175:3001';

  useEffect(() => {
    if (!user) return;
    const newSocket = io(socketUrl, {
      query: { userId: user.userId.toString() },
      transports: ['websocket'],
    });

    newSocket.on('connect_error', err => {
      console.error('[Socket.IO] Connection error:', err.message);
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};