const { TCPConnectionPool } = require('../utils');
const pool = new TCPConnectionPool({
    host: 'localhost',
    port: 8000,
    maxConnections: 10,
});
// Create a function that simulates a long-running task using a connection from the pool
async function runLongTask(id) {
    console.log(`Task ${id} started`);
    const connection = await pool.getConnection();
    console.log(`Task ${id} acquired connection`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Task ${id} releasing connection`);
    pool.releaseConnection(connection);
    console.log(`Task ${id} finished`);
}
(async () => {
    // Create a bunch of tasks that will run concurrently
    const tasks = [];
    for (let i = 0; i < 15; i++) {
        tasks.push(runLongTask(i));
    }

    // Wait for all tasks to complete
    await Promise.all(tasks);

    console.log('All tasks finished');

})()

