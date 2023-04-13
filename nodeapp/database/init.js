const connnection = require("./connection");

connnection.query(`create table users(
	id int auto_increment,
    fullname varchar(50),
    gender tinyint,
    age int,
    check(age > 0),
    primary key(id)
)`, (err, result) => {
    if(err) throw err;
    console.log('Database created')
})