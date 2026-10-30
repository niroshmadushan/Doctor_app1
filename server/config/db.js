// Database connection pool module using mysql2/promise
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'doctordb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

let isConnected = false;
pool.getConnection()
  .then(conn => {
    isConnected = true;
    console.log(`[MySQL Pool]: Connected to MySQL database '${process.env.DB_NAME || 'doctordb'}' at ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'}`);
    conn.release();
  })
  .catch(err => {
    console.warn(`[MySQL Pool Warning]: Could not connect to MySQL server (${err.message}). Operating in resilient standby mode.`);
  });

module.exports = {
  pool,
  isDbConnected: () => isConnected
};
