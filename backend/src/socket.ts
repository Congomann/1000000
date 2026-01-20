import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

export const initSocket = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Adjust in production
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('User connected:', socket.id);

        // Join a specific room (e.g. for team chat or notifications)
        socket.on('join_room', (room: string) => {
            socket.join(room);
        });

        // Chat Message
        socket.on('send_message', (data: { room: string, message: string, user: string }) => {
            io.to(data.room).emit('receive_message', data);
        });

        // Data Sync Notification (e.g. new lead created)
        socket.on('data_updated', (data: { type: string, action: string, id: string }) => {
            socket.broadcast.emit('sync_data', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};
