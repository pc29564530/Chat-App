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

const connectedUsers = new Map();

io.on('connection', (socket) => {
    // connectedUsers.add(socket.id)
    io.emit('Connected Users', socket.id);
    socket.on('chat message', (message) => {
        io.emit('chat message', {
            sender: socket.id,
            message: message
        });
    });

    connectedUsers.set(socket.id, socket);

    socket.on('disconnect', () => {
        connectedUsers.delete(socket.id);
        io.emit('User Disconnected', socket.id);
    })
});



server.listen(3000, () => {
    console.log('listening on *: 3000');
});