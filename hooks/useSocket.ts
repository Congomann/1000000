import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

export const useSocket = (onMessageReceived?: (data: any) => void) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socketRef.current.on('receive_message', (data: any) => {
            if (onMessageReceived) onMessageReceived(data);
        });

        socketRef.current.on('sync_data', (data: any) => {
            console.log('Syncing data:', data);
            // This could trigger a refresh in the caller
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [onMessageReceived]);

    const sendMessage = (room: string, message: string, user: string) => {
        if (socketRef.current) {
            socketRef.current.emit('send_message', { room, message, user });
        }
    };

    const joinRoom = (room: string) => {
        if (socketRef.current) {
            socketRef.current.emit('join_room', room);
        }
    };

    const notifyDataUpdate = (type: string, action: string, id: string) => {
        if (socketRef.current) {
            socketRef.current.emit('data_updated', { type, action, id });
        }
    };

    return { socket: socketRef.current, sendMessage, joinRoom, notifyDataUpdate };
};
