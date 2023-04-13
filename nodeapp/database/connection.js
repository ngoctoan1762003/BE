const mysql = require('mysql')
const connnection = mysql.createConnection({
  host: 'localhost',
  user: 'nodeuser',
  password: '123',
  database: 'be'
})

module.exports = connnection