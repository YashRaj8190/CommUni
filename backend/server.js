const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');
const ConnectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
dotenv.config();
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/error');
const app = express();
const port = 5000;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("Welcome to our website");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler)

// ConnectDB();
// app.listen(port, () => {
//     console.log(`Listening on port ${port} !!`);
// });

//connect to database 
mongoose.connect('mongodb://localhost:27017/CommUni')
    .then(() => {
        //connect to port
        const server = app.listen(port, () => {
            console.log(`Connected to Database and Listening on port ${port} !!`);
        });

        const io = require('socket.io')(server, {
            pingTimeout: 60000,
            cors: {
                origin: "http://localhost:3000",
            },
        });

        io.on("connection", (socket) => {
            console.log('Connected to socket.io');

            socket.on('setup', (userData) => {
                socket.join(userData._id);
                socket.emit('connected');
            });

            socket.on('join chat', (room) => {
                socket.join(room);
                console.log("User joined room: " + room);
            });

            socket.on('new message', (newMessageRecieved) => {
                var chat = newMessageRecieved.chat;

                if (!chat.users) return console.log('chat.users not defined');

                chat.users.forEach(user => {
                    if (user._id == newMessageRecieved.sender._id) return;

                    socket.in(user._id).emit('message recieved', newMessageRecieved);
                });
            });

            socket.on('typing', (room) => socket.in(room).emit('typing'));
            socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

            socket.off('setup', () => {
                console.log('USER DISCONNECTED');
                socket.leave(userData._id);
            });
        });
    })
    .catch((err) => {
        console.log(err);
    })
