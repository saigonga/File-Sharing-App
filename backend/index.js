import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Filesharing!' })
});
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

io.on('connection',(socket)=>{
    console.log('User connected:',socket.id);

    socket.on('join_room', (room)=>{
        socket.join(room);
    });

    socket.on('send_file', (data) => {
        io.to(data.toRoom).emit('receive_file', data);
        io.to(data.toRoom).emit('file_transfer_complete', {
            fileName: data.fileName,
            from: socket.id,
            to: data.toRoom
        });
    });


    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
})

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
