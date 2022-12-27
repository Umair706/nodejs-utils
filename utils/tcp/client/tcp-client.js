const net = require('net');
const { EventEmitter } = require('events');
const redis = require('redis');

class ConnectionHandler extends EventEmitter {
    constructor(config) {
        // Call the super constructor
        super();

        // Initialize the client and other variables
        this.client = null;
        this.reconnecting = false; // Flag to indicate if a reconnection is in progress
        this.connected = false; // Flag to indicate if a reconnection is in progress
        this.dataQueue = [];
        this.config = config || {}; // Initialize the config object
        this.queueData = this.config.queueData || false; // Flag to indicate whether failed packets should be queued? 
        this.attempts = 0; // Initialize the attempts counter
        this.maxAttempts = this.config.maxAttempts || 5; // Set the maximum number of attempts
        this.reconnectInterval = this.config.reconnectInterval || 5000; // Set the reconnect interval
        this.host = this.config.host; // Set the host
        this.port = this.config.port; // Set the port

        // Check if redis is enabled in the config
        if (this.config.redis) {
            // If redis is enabled, create a redis client
            this.redisClient = redis.createClient(this.config.redis);
            // Register an error event listener for the redis client
            this.redisClient.on('error', (error) => {
                console.error(error);
            });
        }

        // Connect to the server
        this.connect();
    }


    connect() {
        this.client = net.createConnection({
            host: this.host,
            port: this.port
        });

        this.client.on('connect', () => {
            this.attempts = 0; // Reset the attempts counter
            this.reconnecting = false; // Reset the reconnecting flag
            this.connected = true; // Set the connected flag to true
            this.processQueue(); // Process Queue
            this.emit('connect');
        });

        this.client.on('close', () => {
            this.emit('disconnect');
            this.connected = false; // Set the connected flag to false
            this.reconnect();
        });

        this.client.on('error', (error) => {
            this.emit('error', error);
            this.reconnect();
        });
    }

    reconnect() {
        console.log('Re-Attempting Connection to OSS Server');
        if (this.client) {
            this.client.removeAllListeners();
            this.client = null;
        }
        // Check if a reconnection is already in progress
        if (this.reconnecting) {
            return; // Do not start a new reconnection if one is already in progress
        }
        this.reconnecting = true; // Set the reconnecting flag to indicate a reconnection is in progress

        // Increment the number of attempts
        this.attempts++;

        // Check if the maximum number of attempts has been reached
        if (this.attempts > this.maxAttempts) {
            // Emit an error event if the maximum number of attempts has been reached
            this.emit('error', new Error('Maximum number of attempts reached'));
            return;
        }
        setTimeout(() => this.connect(), this.reconnectInterval);
    }

    send(data) {
        if (this.client) {
            this.client.write(JSON.stringify(data));
        } else {
            if (!this.queueData) return;
            // If the client is not yet connected, queue the data
            if (this.config?.redis) {
                this.redisClient.rpush('data_queue', JSON.stringify(data), (error) => {
                    if (error) {
                        console.error(error);
                    }
                });
            } else {

                this.dataQueue = this.dataQueue || [];
                this.dataQueue.push(data);

            }
        }
    }
    processQueue() {
        if (!this.queueData) return;

        if (this.config?.redis) {
            this.processDataFromQueue();
        } else {
            // Check if there is any queued data
            if (this.dataQueue && this.dataQueue.length > 0) {
                // Process the queued data
                this.dataQueue.forEach((data) => {
                    this.client.write(JSON.stringify(data));
                });
                // Clear the queue
                this.dataQueue = [];
            }
        }
    }
    processDataFromQueue() {
        if (!this.queueData) return;

        if (!this.config?.redis) return;

        this.redisClient.lpop('data_queue', (error, data) => {
            if (error) {
                console.error(error);
            } else if (data) {
                this.client.write(JSON.stringify(data));
                this.processDataFromQueue(); // Recursively call the function to get the next item from the queue
            }
        });
    }
}

module.exports = ConnectionHandler;