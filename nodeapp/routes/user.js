const express = require('express');
const userRouter = express.Router();

const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
userRouter.use(express.json());
userRouter.use(express.urlencoded({extended: true}));

const validate = require('../middleware/validate')
const connnection = require('../database/connection')
const connection2 = require('../database/knexConnection')
const auth = require('./auth')

const {
    publicKey,
    privateKey
} = crypto.generateKeyPairSync('rsa', {modulusLength: 2048});
  
let users
  userRouter.get('/', (req, res) => {
    
    connnection.query('select * from users', (err, result) => {
      users = result;
      res.status(200).send(users)
    })
  })
  
  userRouter.get('/:id', (req, res) => {
    //get username from query string
    const id = req.params.id
    //get token from request
    const authorizationHeader = req.headers.authorization //Bearer <Token>
    //console.log(authorizationHeader)
    const userToken = authorizationHeader.substring(7) //cut 7 first char to get token
    //console.log(userToken)

    try{
        //public decrypt instead of secret key
        const isValidToken = jsonwebtoken.verify(authorizationHeader, process.env.JWT_SECRET)
        console.log(JSON.stringify(isValidToken.username))
        if(isValidToken.username === username){
            let users
            connnection.query('select * from users where id=?', [req.params.id],(err, result) => {
                users = result;
                res.status(200).send(users)
            })

            return res.status(200).json({
                user: users
            })
        }
    }
    catch(error){
        return res.status(500).json({
            message: error.message
        })
    }


    // connnection.query('select * from users where id=?', [req.params.id],(err, result) => {
    //   users = result;
    //   res.status(200).send(users)
    // })
  })
  
  userRouter.put('/:id', validate.validate, (req, res) => {
    connnection.query(`update users set name = ?, gender = ?, age = ? where id = ?`, [req.body.name, req.body.gender, req.body.age, req.params.id],(err, result) => {
      if(err){
        return res.status(400).json({
            message: err.message
        })
      }
      res.status(204).json({
        message: "Update success"
      });
    })
  })
  
//   userRouter.post('/', validate.validate, (req, res) => {
//     connnection.query(`insert into users (name, gender, age) values (?,?,?)`, [req.body.name, req.body.gender, req.body.age],(err, result) => {
//       if(err){
//         return res.status(400).json({
//             message: err.message
//         })
//       }
//       res.status(201).json({
//         message: "Insert success"
//       });
//     })
//   })
  
//   userRouter.delete('/:id', validate, (req, res) => {
//     connnection.query(`delete from users where id=?`, [req.params.id],(err, result) => {
//       if(err){
//         return res.status(400).json({
//             message: err.message
//         })
//       }
//       res.status(204).json({
//         message: "Delete success"
//       });
//     })
//   })
  // Exports cho biến userRouter
module.exports = userRouter;
