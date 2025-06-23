module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id);

        // Example: Listening to chat message event
        socket.on('chat message', (msg) => {
            console.log('Message received:', msg);
            io.emit('chat message', msg); // Broadcast to all clients
        });

        socket.on('disconnect', () => {
            console.log('User disconnected: ' + socket.id);
        });
    });
};
