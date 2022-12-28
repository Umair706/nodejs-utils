# TCP Connection Pool
A simple TCP connection pool for Node.js.

# Usage
To use the connection pool, you need to import the ConnectionPool class and create an instance of it. You can pass a configuration object as an argument to the constructor. The configuration object can have the following properties:

* **maxConnections:** The maximum number of connections that the pool can hold.
To get a connection from the pool, call the getConnection method. This method returns a promise that resolves with a connection object. The connection object has a busy property that indicates whether the connection is being used or not.

To release a connection back to the pool, call the '**releaseConnection**'  method and pass the connection object as an argument. This will set the busy property of the connection object to false.

To end all connections in the pool, call the '**end**' method. This will destroy all the connections in the pool and reset the pool.

Here's an example of how to use the connection pool:
```

const ConnectionPool = require('tcp-connection-pool');

const pool = new ConnectionPool({ maxConnections: 5 });

// Get a connection from the pool
const connection = await pool.getConnection();

// Do something with the connection

// Release the connection back to the pool
pool.releaseConnection(connection);

// End all connections in the pool
await pool.end();

```

# License
This package is licensed under the MIT license.