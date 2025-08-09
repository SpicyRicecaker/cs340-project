// Get an instance of mysql we can use in the app
import mysql from 'mysql2'
import { config } from 'dotenv'

config()

const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit   : 10,
    host              : process.env.DB_HOST,
    user              : process.env.DB_USER,
    password          : process.env.DB_PASSWORD,
    database          : process.env.DB_NAME 
}).promise(); // This makes it so we can use async / await rather than callbacks

// Export it for use in our application
export default pool;
