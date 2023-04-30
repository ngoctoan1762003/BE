// const express = require('express');
// const crypto = require('crypto')
// const jsonwebtoken = require('jsonwebtoken')
// const longin_router= express.Router();
// const secret = 'secret'
// longin_router.use(express.json());
// longin_router.use(express.urlencoded({extended: true}));

// // const validate = require('../middleware/validate')
// // const connnection = require('../database/connection')

// const {
//     publicKey,
//     privateKey
// } = crypto.generateKeyPairSync('rsa', {modulusLength: 2048});

// const dbs = [
//     {
//         username: 'thinh',
//         age: 22,
//         email: 'thinh@gmail.com',
//         id: 1,
//         pasword: 'thinh12345',
//         balance: 1000000
//     },
//     {
//         username: 'phu',
//         age: 22,
//         email: 'phu@gmail.com',
//         id: 1,
//         pasword: 'phu123',
//         balance: 1000000000
//     }
// ]

// longin_router.post('/login', (req, res, next) => {
//     const username = req.body.username
//     const password = req.body.password

//     const user = dbs.find(u => u.username === username)

//     if(!user) {
//         return res.status(404).json({
//             message: "user not found"
//         })
//     }
    
//     //privatekey encrypt instead of secret key
//     if(user.pasword === password){
//         const jwt = jsonwebtoken.sign({
//             username: user.username,
//             email: user.email,
//             age: user.age
//         }, privateKey, {
//             algorithm: 'RS256',
//             expiresIn: '1h'
//         })

//         res.status(201).json({
//             data: jwt,
//             message: 'Login success'
//         })
//     }

//     return res.status(401).json({
//         message: ' invalid credential'
//     })
// })

// longin_router.get('/balance', (req, res, next) => {
//     //get username from query string
//     const username = req.query.username
//     console.log(username)
//     //get token from request
//     const authorizationHeader = req.headers.authorization //Bearer <Token>
//     //console.log(authorizationHeader)
//     const userToken = authorizationHeader.substring(7) //cut 7 first char to get token
//     //console.log(userToken)

//     try{
//         //public decrypt instead of secret key
//         const isValidToken = jsonwebtoken.verify(authorizationHeader, publicKey)
//         console.log(JSON.stringify(isValidToken.username))
//         if(isValidToken.username === username){
//             const user = dbs.find(u => u.username === username)
//             const balance = user.balance
//             return res.status(200).json({
//                 balance
//             })
//         }
//     }
//     catch(error){
//         return res.status(500).json({
//             message: error.message
//         })
//     }
// })

// module.exports = longin_router;

