import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
const app = express();

// Security middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// File validation utilities
const ALLOWED_FILE_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'text/plain', 'text/csv', 'application/pdf', 'application/json',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ROOM_ID_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

// Rate limiting store
const rateLimitStore = new Map();
const MAX_UPLOADS_PER_MINUTE = 5;

const validateFile = (fileData) => {
    if (!fileData.fileName || !fileData.fileType || !fileData.fileBuffer) {
        return { valid: false, error: 'Missing file data' };
    }

    if (fileData.fileSize > MAX_FILE_SIZE) {
        return { valid: false, error: 'File too large' };
    }

    if (!ALLOWED_FILE_TYPES.includes(fileData.fileType)) {
        return { valid: false, error: 'File type not allowed' };
    }

    if (fileData.fileName.length > 255) {
        return { valid: false, error: 'File name too long' };
    }

    return { valid: true };
};

const validateRoomId = (roomId) => {
    return ROOM_ID_REGEX.test(roomId);
};

const checkRateLimit = (socketId) => {
    const now = Date.now();
    const userAttempts = rateLimitStore.get(socketId) || [];
    const recentAttempts = userAttempts.filter(timestamp => now - timestamp < 60000);
    
    if (recentAttempts.length >= MAX_UPLOADS_PER_MINUTE) {
        return false;
    }
    
    recentAttempts.push(now);
    rateLimitStore.set(socketId, recentAttempts);
    return true;
};

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Filesharing!' })
});
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (room) => {
        if (!validateRoomId(room)) {
            socket.emit('error', { message: 'Invalid room ID' });
            return;
        }
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on('send_file', (data) => {
        // Rate limiting check
        if (!checkRateLimit(socket.id)) {
            socket.emit('error', { message: 'Rate limit exceeded. Please wait before sending another file.' });
            return;
        }

        // Validate room ID
        if (!validateRoomId(data.toRoom)) {
            socket.emit('error', { message: 'Invalid room ID' });
            return;
        }

        // Validate file
        const fileValidation = validateFile(data);
        if (!fileValidation.valid) {
            socket.emit('error', { message: fileValidation.error });
            return;
        }

        // Sanitize file name
        const sanitizedFileName = data.fileName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '').substring(0, 255);

        console.log(`File transfer: ${sanitizedFileName} (${data.fileSize} bytes) to room ${data.toRoom}`);

        // Send file to room members
        const fileData = {
            ...data,
            fileName: sanitizedFileName,
            from: socket.id,
            timestamp: new Date().toISOString()
        };

        io.to(data.toRoom).emit('receive_file', fileData);
        io.to(data.toRoom).emit('file_transfer_complete', {
            fileName: sanitizedFileName,
            from: socket.id,
            to: data.toRoom,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Clean up rate limiting data after some time
        setTimeout(() => {
            rateLimitStore.delete(socket.id);
        }, 300000); // 5 minutes
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
