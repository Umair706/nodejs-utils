# ConnectionHandler
It is a utility class that helps in establishing and maintaining a connection with a tcp server. It attempts to reconnect to the server in case the connection is lost. It also provides a way to queue data that needs to be sent to the server when the connection is not yet established.


# Features
Attempts to reconnect to the server in case the connection is lost
Queues data that needs to be sent to the server when the connection is not yet established
Option to store the data queue in Redis


# Usage
```

const ConnectionHandler = require('connection-handler');

const config = {
    host: 'localhost',
    port: 8080,
    reconnectInterval: 5000, // optional, defaults to 5000
    maxAttempts: 5, // optional, defaults to 5
    queueData:true // optional, defaults to false,
    redis: {
        // Redis client options (https://www.npmjs.com/package/redis#options-object-properties)
    }
};

const connectionHandler = new ConnectionHandler(config);

connectionHandler.on('connect', () => {
    console.log('Connected to the server');
});

connectionHandler.on('disconnect', () => {
    console.log('Disconnected from the server');
});

connectionHandler.on('error', (error) => {
    console.error(error);
});

connectionHandler.send({ message: 'Hello, Server!' });
```
# API
- **Constructor(config)**
     * **config (Object):** Configuration object with the following properties:
          * **host (String):** Hostname of the server.
          * **port (Number):** Port of the server.
          * **queueData (Bollean):** Should queue data or not.
          * **reconnectInterval (Number, optional):** Interval in milliseconds between each attempt to reconnect to the server. Defaults to 5000.
          * **maxAttempts (Number, optional):** Maximum number of attempts to reconnect to the server. Defaults to 5.
          * **redis (Object, optional):** Redis configuration object with the following properties:
enabled (Boolean): Whether to use Redis to store the data queue.
Additional properties will be passed to the redis.createClient() function as options.

# Event: 'connect'
Emitted when the connection to the server is established.

# Event: 'disconnect'
Emitted when the connection to the server is lost.

# Event: 'error'
Emitted when an error occurs while attempting to establish a connection with the server.

- # send(data)
Sends data to the server. If the connection to the server is not yet established, the data will be queued until the connection is established.

* data (any): Data to be sent to the server. Will be stringified before being sent.

# License
MIT