const net = require('net');

const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.on('data', (data) => {
        console.log(`Received data from client: ${data}`);
        socket.write(`Echo: ${data}`);
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });
    socket.on('error', (error) => {
        console.log('Client Error', error);
    });
});

server.listen(8000, () => {
    console.log('Server listening on port 8000');
});