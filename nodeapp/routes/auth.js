const express = require('express');
const crypto = require('crypto')
const jsonwebtoken = require('jsonwebtoken')
const auth_router= express.Router();
const secret = 'secret'
auth_router.use(express.json());
auth_router.use(express.urlencoded({extended: true}));

const connnection = require('../database/connection')
const { hashPasswordWithSalt, hashPasswordWithAvailableSalt } = require('../helper/hash')
const validate = require('../middleware/validate');
const { resolve } = require('path');
const { rejects } = require('assert');

const {
    publicKey,
    privateKey
} = crypto.generateKeyPairSync('rsa', {modulusLength: 2048});

auth_router.post('/register', validate.validateRegister,async (req, res, next) => {
    const{
        username,
        password,
        name,
        age,
        email,
        gender
    }   = req.body

    await connnection.query('select * from users where username = ?', [username], (err, result) => {
        if(err) {
            return res.status(500).json({
                message: "internal server error"
            })
        }

        const user = result[0]
        if(user){
            return res.status(400).json({
                message: "username is already taken"
            })
        }
    })

    const {
        salt,
        hashedPassword,
    } = hashPasswordWithSalt(password)

    //console.log(hashPassword, salt)

    connnection.query('insert into users (username, password, name, age, gender, email, salt) values(?, ?, ?, ?, ?, ?, ?)', [username, hashedPassword, name, age, gender, email, salt], (err, result) => {
        return res.status(200).json({
            message: "Success"
        })
      })

    return res.status(401).json({
        message: ' invalid credential'
    })
})

auth_router.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    let user 
    await new Promise(() => {
        
        connnection.query('select * from users where username = ?', [username], async (err, result) => {
            if(err) {
                return res.status(500).json({
                    message: "internal server error"
                })
            }
    
            user = result[0] 
    
            console.log(user)
            
            if(user === undefined){
                return res.status(400).json({
                    message: "username doesnot exist"
                })
            }

            //privatekey encrypt instead of secret key
            hashedPassword = hashPasswordWithAvailableSalt(password, user.salt)
            console.log(hashedPassword.toString())
            console.log(user.password.toString())

            //console.log(hashPassword, salt)
            if(user.password.toString() === hashedPassword.toString()){
                const jwt = jsonwebtoken.sign({
                    username: user.username,
                    email: user.email,
                    age: user.age
                }, privateKey, {
                    algorithm: 'RS256',
                    expiresIn: '1h'
                })
        
                return res.status(201).json({
                    data: jwt,
                    message: 'Login success'
                })  
            }
            else{
                return res.status(401).json({
                    message: ' invalid credential',
                    hashedPassword: hashedPassword,
                    userPassword: user.password
                })
            }
        
        
        })
    })

})

module.exports = auth_router;

