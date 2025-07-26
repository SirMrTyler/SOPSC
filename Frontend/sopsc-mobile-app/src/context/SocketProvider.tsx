import React, { createContext, useContext, ReactNode, MutableRefObject } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../hooks/useSocket';

const SocketContext = createContext<MutableRefObject<Socket | null> | null>(null);

export const useSocketContext = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return ctx;
};

interface SocketProviderProps {
  user: any;
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ user, children }) => {
  const socketRef = useSocket(user);
  return <SocketContext.Provider value={socketRef}>{children}</SocketContext.Provider>;
};