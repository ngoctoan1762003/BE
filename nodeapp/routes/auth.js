const express = require('express');
const crypto = require('crypto')
const jsonwebtoken = require('jsonwebtoken')
const authRouter= express.Router();
const secret = 'secret'
authRouter.use(express.json());
authRouter.use(express.urlencoded({extended: true}));

const connnection = require('../database/connection')
const { hashPasswordWithSalt, hashPasswordWithAvailableSalt } = require('../helper/hash')
const validate = require('../middleware/validate');

const {
    publicKey,
    privateKey
} = crypto.generateKeyPairSync('rsa', {modulusLength: 2048});

authRouter.post('/register', validate.validateRegister,async (req, res) => {
    const{
        username,
        password,
        name,
        age,
        email,
        gender
    }   = req.body

    await new Promise(() =>{
        
        connnection.query('select * from users where username = ?', [username], (err, result) => {
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
})

authRouter.post('/login', async (req, res) => {
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
        
                return res.status(200).json({
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

authRouter.get('/:id', async (req, res) => {
    //get username from query string
    const id = req.params.id
    //get token from request
    const authorizationHeader = req.headers.authorization //Bearer <Token>
    console.log(authorizationHeader)
    console.log(publicKey.export({ type: 'spki', format: 'pem' }));
    console.log(privateKey.export({ type: 'pkcs8', format: 'pem' }));

    //const userToken = authorizationHeader.substring(7) //cut 7 first char to get token
    //console.log(userToken)

    try{
        //public decrypt instead of secret key
        const isValidToken = jsonwebtoken.verify(authorizationHeader, publicKey)
        username = isValidToken.username
        console.log(username)
        await new Promise(() => {
            let users
            let usernameRes
            connnection.query('select * from users where id=?', [req.params.id],(err, result) => {
                users = result[0];
                usernameRes = users.username.toString()
                console.log(users)
                console.log(usernameRes)
                if(usernameRes == username){
                    return res.status(200).json({
                        user: users
                    })
                }
                else{
                    return res.status(404).json({
                        message: "Not authorized"
                    })
                }
            })
        })
    }
    catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
})
module.exports = authRouter;

