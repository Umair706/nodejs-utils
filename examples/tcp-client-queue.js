const { tcpClient } = require('../utils');
const config = {
    host: "192.168.1.82",
    port: "8000",
    queueData: true,
}
const connection = new tcpClient(config);
for (let i = 0; i < 100; i++) {
    // This should queue
    connection.send({ sample: "Data " + i })
}
connection.on('data', (data) => {
    console.log(`Recevied Data From TCP Server`, data);
});
connection.on('end', () => {
    console.log(`Recevied end Even From TCP Server`);
});
connection.on('error', () => {
    console.log(`Recevied error Even From TCP Server`);
});
connection.on('close', () => {
    console.log(`Recevied close Even From TCP Server`);
});
connection.on('connect', () => {
    console.log(`Recevied connect Event From TCP Server`);
    connection.send({ sample: "Connected OK" })
});
