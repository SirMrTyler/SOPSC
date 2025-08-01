import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (user: any) => {
    const socketRef = useRef<Socket | null>(null);
    const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://192.168.1.175:3001'; // Fallback for local development

    useEffect(() => {
        if (!user || socketRef.current) return;
        

        // Establish socket connection with userId query
        socketRef.current = io(socketUrl, {
        query: {
            userId: user?.userId?.toString(),
        },
        transports: ['websocket'],
        });

        /* Connection status logs
        socketRef.current.on('connect', () => {
        console.log('[Socket.IO] Connected:', socketRef.current?.id);
        });

        
        socketRef.current.on('disconnect', () => {
            console.warn('[Socket.IO] Disconnected');
            });
            */
       socketRef.current.on('connect_error', err => {
       console.error('[Socket.IO] Connection error:', err.message);
       });

        // Listen for new direct messages
        socketRef.current.on('newDirectMessage', (msg) => {
        console.log('[Socket.IO] Received newDirectMessage:', msg);
        // TODO: forward msg to state, callback, or event emitter
        });

        // Cleanup
        return () => {
        socketRef.current?.disconnect();
        socketRef.current = null;
        };
    }, [user]);

    return socketRef;
};
