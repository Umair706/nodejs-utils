const TCPClient = require('../client/tcp-client');

class ConnectionPool {
    constructor(config) {
        this.config = config;
        this.connections = [];
        this.connectionQueue = [];
    }

    async createConnection() {
        const connection = new TCPClient(this.config);
        this.connections.push(connection);
        return connection;
    }

    async getConnection() {
        let connection = this.connections.find(conn => !conn.busy);
        if (!connection) {
            if (this.connections.length < this.config.maxConnections) {
                connection = await this.createConnection();
            } else {
                return new Promise((resolve, reject) => {
                    this.connectionQueue.push({ resolve, reject });
                });
            }
        }
        connection.busy = true;
        return connection;
    }

    releaseConnection(connection) {
        connection.busy = false;
        const queuedConnection = this.connectionQueue.shift();
        if (queuedConnection) {
            queuedConnection.resolve(connection);
        }
    }

    async end() {
        this.connections.forEach(conn => conn.destroy());
        this.connections = [];
        this.connectionQueue = [];
    }
}
module.exports = ConnectionPool;