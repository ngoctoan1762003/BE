const mysql = require('mysql')
const env = require('dotenv')
env.config();
const connnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sgroup',
  dateStrings: true,
})

module.exports = connnection