const { TCPConnectionPool } = require('../utils');
const pool = new TCPConnectionPool({
    host: 'localhost',
    port: 8000,
    maxConnections: 10,
});

async function testConnectionPool() {
    const connection = await pool.getConnection();
    console.log('Got connection:')
    connection.send({ connection: "connection" });
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
}
testConnectionPool();