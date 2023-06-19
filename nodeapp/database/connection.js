const mysql = require('mysql')
const env = require('dotenv')
env.config();
const connnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: '',
  database: 'sgroup',
  dateStrings: true,
})

module.exports = connnection