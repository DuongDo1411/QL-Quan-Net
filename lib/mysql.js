const mysql = require('mysql2/promise');
const fs = require('fs');


const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT || 3306,
  database: 'cmp175', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection(async (err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

module.exports = { mysql, pool };
 