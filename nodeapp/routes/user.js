const express = require('express');
const user_router = express.Router();

user_router.use(express.json());
user_router.use(express.urlencoded({extended: true}));

const validate = require('../middleware/validate')
const connnection = require('../database/connection')

// let users = [
//     {
//       "id": 1,
//       "fullname": "Nguyen Huy Tuong",
//       "gender": true,
//       "age": 18
//     },
//     {
//       "id": 2,
//       "fullname": "Nguyen Thi Tuong",
//       "gender": false,
//       "age": 15
//     }
//   ]
  
let users
  user_router.get('/', (req, res) => {
    
    connnection.query('select * from users', (err, result) => {
      users = result;
      res.status(200).send(users)
    })
  })
  
  user_router.get('/:id', (req, res) => {
    connnection.query('select * from users where id=?', [req.params.id],(err, result) => {
      users = result;
      res.status(200).send(users)
    })
  })
  
  user_router.put('/:id', validate, (req, res) => {
    connnection.query(`update users set fullname = ?, gender = ?, age = ? where id = ?`, [req.body.fullname, req.body.gender, req.body.age, req.params.id],(err, result) => {
      if(err){
        return console.error(err.message)
      }
      res.status(204).send();
    })
  })
  
  user_router.post('/', validate, (req, res) => {
    connnection.query(`insert into users (fullname, gender, age) values (?,?,?)`, [req.body.fullname, req.body.gender, req.body.age],(err, result) => {
      if(err){
        return console.error(err.message)
      }
      res.status(201).send();
    })
  })
  
  user_router.delete('/:id', validate, (req, res) => {
    connnection.query(`delete from users where id=?`, [req.params.id],(err, result) => {
      if(err){
        return console.error(err.message)
      }
      res.status(204).send();
    })
  })
  // Exports cho biến user_router
module.exports = user_router;
