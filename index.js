const express = require('express');
const app = express();
const http = require('http');
const { connected } = require('process');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {

    socket.on('setNickname', (nickname) => {
        users[socket.id] = nickname;
        socket.broadcast.emit('chat message', `${nickname} has joined the chat.`); 
    });

    socket.on('chatMessage', (message) => {
        const nickname = users[socket.id];
        socket.broadcast.emit('chatMessage', `${nickname}: ${message}`);
        socket.emit('chatMessage', `You: ${message}`);
    });

    socket.on('disconnect', () => {
        const nickname = users[socket.id];
        delete users[socket.id];
        socket.broadcast.emit('chatMessage', `${nickname} is disconnected from the chat.`);
    })
});



server.listen(3000, () => {
    console.log('listening on *: 3000');
});