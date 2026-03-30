const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Security Middlewares
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

dotenv.config();

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

// Main Middlewares
app.use(express.json());
app.use(cors());

// Security
app.use(mongoSanitize());
// Basic helmet but avoid breaking front-end CDNs
app.use(helmet({ contentSecurityPolicy: false }));
app.use(xss());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// Serve Static Frontend
app.use(express.static(path.join(__dirname, './')));

// Real-time Chat Logic
const Message = require('./models/Message');

io.on('connection', (socket) => {
    console.log('🔗 New Chat Connection: ', socket.id);

    // Join specialized room (e.g. Faculty-specific)
    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        console.log(`${username} joined ${room}`);
    });

    // Handle Incoming Messages
    socket.on('chatMessage', async (data) => {
        const { senderId, content, room } = data;
        try {
            const message = await Message.create({ sender: senderId, content, room });
            const fullMsg = await Message.findById(message._id).populate('sender', 'name profilePic');
            io.to(room).emit('message', fullMsg);
        } catch (err) {
            console.error('Chat Error:', err.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔌 Chat User Disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 ABSU Full-stack Platform running on port ${PORT}`);
});
