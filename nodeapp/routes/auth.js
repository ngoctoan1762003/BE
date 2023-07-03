const express = require('express');
const { mailService } = require("../service/mail.service")
const crypto = require('crypto')
const jsonwebtoken = require('jsonwebtoken')
const authRouter= express.Router();
const secret = 'secret'
authRouter.use(express.json());
authRouter.use(express.urlencoded({extended: true}));

const connnection = require('../database/connection')
const connection2 = require('../database/knexConnection')
const { hashPasswordWithSalt, hashPasswordWithAvailableSalt } = require('../helper/hash')
const validate = require('../middleware/validate');
const knex = require('../database/knexConnection');
const pagination = require('../helper/pagination');

const {
    publicKey,
    privateKey
} = crypto.generateKeyPairSync('rsa', {modulusLength: 2048});
  
//SQL raw-----------
// authRouter.post('/register', validate.validateRegister,async (req, res) => {
//     const{
//         username,
//         password,
//         name,
//         age,
//         email,
//         gender
//     }   = req.body

//     await new Promise(() =>{
        
//         connnection.query('select * from users where username = ?', [username], (err, result) => {
//             if(err) {
//                 return res.status(500).json({
//                     message: "internal server error"
//                 })
//             }
    
//             const user = result[0]
//             if(user){
//                 return res.status(400).json({
//                     message: "username is already taken"
//                 })
//             }
    
    
//         })
    
//         const {
//             salt,
//             hashedPassword,
//         } = hashPasswordWithSalt(password)
    
//         //console.log(hashPassword, salt)
    
//         connnection.query('insert into users (username, password, name, age, gender, email, salt) values(?, ?, ?, ?, ?, ?, ?)', [username, hashedPassword, name, age, gender, email, salt], (err, result) => {
//             return res.status(200).json({
//                 message: "Success"
//             })
//           })
    
//         return res.status(401).json({
//             message: ' invalid credential'
//         })
//     })
// })

authRouter.post('/register', validate.validateRegister,async (req, res) => {
    const authorizationHeader = req.headers.authorization
    console.log(authorizationHeader)
    const isValidToken = jsonwebtoken.verify(authorizationHeader, process.env.JWT_SECRET)
    const id = isValidToken.id

    if(isValidToken){

        const {
            username,
            password,
            name,
            age,
            email,
            gender
          } = req.body;
        
          try {
            const existingUser = await connection2('users').where('username', username).first();
            if (existingUser) {
              return res.status(400).json({
                message: "Username is already taken"
              });
            }
        
            const {
              salt,
              hashedPassword,
            } = hashPasswordWithSalt(password);
        
            time = new Date(Date.now())
            await connection2('users').insert({
              username,
              password: hashedPassword,
              name,
              age,
              gender,
              email,
              salt,
              createdAt: time,
              createdBy: id
            });
        
            return res.status(200).json({
              message: "Success"
            });
          } catch (err) {
            console.log(err);
            return res.status(500).json({
              message: "Internal server error"
            });
          }
    }
    else{
        return res.status(500).json({
            message: "Sai SQL ROI"
          });
    }
});

authRouter.post('/login', async (req, res) => {
    console.log(process.env.DB_HOST);
    console.log(process.env.DB_USER);
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
                    age: user.age,
                    id: user.id
                }, process.env.JWT_SECRET, {
                    
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

authRouter.get('/:id',validate.canAccessBy("CanCreateUser", "CanReadUser") , async (req, res) => {
    //get username from query string
    const id = req.params.id
    //get token from request
    const authorizationHeader = req.headers.authorization //Bearer <Token>
    console.log(authorizationHeader)
    //console.log(process.env.JWT_SECRET.export({ type: 'spki', format: 'pem' }));
    //console.log(privateKey.export({ type: 'pkcs8', format: 'pem' }));

    //const userToken = authorizationHeader.substring(7) //cut 7 first char to get token
    //console.log(userToken)

    try{
        //public decrypt instead of secret key
        const isValidToken = jsonwebtoken.verify(authorizationHeader, process.env.JWT_SECRET)
        username = isValidToken.username
        console.log(username)
        await new Promise(() => {
            let users
            let usernameRes
            connnection.query('select * from users where id=?', [req.params.id],(err, result) => {
                if(err) {
                    return res.status(500).json({
                        message: err.message
                    })
                }
                users = result[0];
                usernameRes = users.username.toString()
                console.log(users)
                console.log(usernameRes)
                // if(usernameRes == username){
                //     return res.status(200).json({
                //         user: users
                //     })
                // }
                // else{
                //     return res.status(404).json({
                //         message: "Not authorized"
                //     })
                // }
                return res.status(200).json({
                    user: users
                })
            })
        })
    }
    catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
})

authRouter.put('/:id', validate.validate, (req, res) => {
    const id = req.params.id
    const authorizationHeader = req.headers.authorization
    try{
        const isValidToken = jsonwebtoken.verify(authorizationHeader, process.env.JWT_SECRET)
        username = isValidToken.username
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
    }
    catch(error) {
        return res.status(500).json({
            message: error.message
        })
    }
  })

authRouter.delete('/:id', validate.validate, (req, res) => {
    const id = req.params.id
    const authorizationHeader = req.headers.authorization
    try{
        
        connnection.query(`delete from users where id=?`, [req.params.id],(err, result) => {
            if(err){
            return res.status(400).json({
                message: err.message
            })
            }
            res.status(204).json({
            message: "Delete success"
            });
        })
    }
    catch(error){
        return res.status(500).json({
            message: "Error"
        })
    }
})

authRouter.get('/search/:name', async (req, res) => {
    //get username from query string
    const name = req.params.name

    await new Promise(() => {
        connnection.query("select * from users where name like ?", ['%' + name + '%'],(err, result) => {
            const list_items = pagination(result, 3, 3)
            if(list_items.length >= 1)
                return res.status(200).json({
                    message: 'Found',
                    list_items
                })
            else
                return res.status(400).json({
                    message: 'Out of range'
                })
        })
    })
})


authRouter.post('/forgot-password', async(req, res) => {
    let email = req.query.email
    console.log(email)
    connnection.query('select * from users where email = ?', [email], async (err, result) => {
        if(err) {
            return res.status(500).json({
                err,
                message: "internal server error"
            })
        }

        user = result[0] 

        console.log(user)
        
        if(user === undefined){
            return res.status(400).json({
                message: "email doesnot exist"
            })
        }
        else{
            const pwdResetToken = crypto.randomBytes(16).toString('hex');
            const expireToken = new Date(Date.now() + 10*60*1000)
            console.log(pwdResetToken)
            console.log(expireToken)
            connnection.query('update users set passwordResetToken = ?, passwordResetExpiration = ? where email = ?', [pwdResetToken, expireToken, email], async (err, result) => {
                try {
                    await mailService.sendEmail({
                        emailFrom: 'toan1762003@gmail.com',
                        emailTo: '102210382@sv1.dut.udn.vn',
                        emailSubject: "Reset Email",
                        emailText: `${pwdResetToken}`
                    });
                
                    return res.status(200).json({
                      message: 'reset password email sent successfully',
                    });
                } catch (error) {
                    return res.status(500).json({
                        message: error.message,
                    });
                }
            })
        }
    })
})

authRouter.post('/reset-password', async (req, res) => {
    let passwordResetToken = req.body.passwordResetToken
    let email = req.body.email
    let newPassword = req.body.newPassword
    console.log(passwordResetToken, email)
    
    console.log(new Date(Date.now() + 10 * 60 * 1000))
    let time = new Date(Date.now())
    console.log(new Date(Date.now()))
    connnection.query("SELECT * FROM users WHERE email = ? AND passwordResetToken = ? AND passwordResetExpiration >= ?",
    [email, passwordResetToken, time], 
    (error, result) => {
        if(error)
        {
            console.log(error);
            return res.status(400).json("fail")
        }
        const resultUser = result[0]
        console.log( result[0])
        if (resultUser === undefined){
            return res.status(400).json({
                message: "Token expired"
            })
        }
        
        const{
            salt,
            hashedPassword
        } = hashPasswordWithSalt(newPassword)
        console.log(salt, hashedPassword)
        connnection.query('update users set password = ?, salt = ?, passwordResetToken = null, passwordResetExpiration = null where email = ?',
        [hashedPassword, salt, email],
        (req, result) => {
            return res.status(200).json({
                message: 'Reset successfully'
            })
        })
        
    })

    
})


module.exports = authRouter;

