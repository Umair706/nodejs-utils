const { tcpClient } = require('../utils');
const config = {
    host: "192.168.1.82",
    port: "8000",
}
const connection = new tcpClient(config);

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
    connection.send({ sample: "Data" })
});
