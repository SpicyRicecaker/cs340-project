// Get an instance of mysql we can use in the app
const mysql = require("mysql2");

// Create a 'connection pool' using the provided credentials
// const pool = mysql.createPool({
//     waitForConnections: true,
//     connectionLimit   : 10,
//     host              : '***REDACTED***',
//     user              : '***REDACTED***',
//     password          : '***REDACTED***',
//     database          : '***REDACTED***'
// }).promise(); // This makes it so we can use async / await rather than callbacks

const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit   : 10,
    host              : 'localhost',
    user              : 'root',
    password          : 'asdf',
    database          : 'test'
}).promise(); // This makes it so we can use async / await rather than callbacks

// Export it for use in our application
module.exports = pool;