const mysql = require('mysql')
const connnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sgroup'
})

module.exports = connnection