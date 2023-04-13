const mysql = require('mysql')
const connnection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1762003',
  database: 'be'
})

connnection.query('select * from item', (err, res) => {
    console.log(err);
    console.log(res);
})
