const express = require('express');
const voteRouter = express.Router();
const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const connection = require('../database/connection');
const connectionKnex = require('../database/knexConnection')
const { hashPasswordWithSalt, hashPasswordWithAvailableSalt } = require('../helper/hash');
voteRouter.use(express.json());
voteRouter.use(express.urlencoded({extended: true}));
const {
    publicKey,
    privateKey
} = crypto.generateKeyPairSync('rsa', {modulusLength: 2048});

voteRouter.get('/', async (req, res) => {
    let pollList = [];
    let tempMap = [];
    const poll = await connectionKnex.select('*')
                                .from('poll')
                                .join('option', 'option.poll_id', 'poll.id')
                                .then(rowsRaw => {
                                    let rows = Object.values(JSON.parse(JSON.stringify(rowsRaw)))

                                    rows.forEach(row => {
                                        let id = row.id;
                                        let name = row.name;
                                        let question = row.question;
                                        let title = row.title;
                                       
                                        if(!tempMap[id]) {
                                            tempMap[id] = [];
                                            tempMap[id].push({
                                                id,
                                                name,
                                                question,
                                                title
                                            })
                                        }
                                        else{
                                            tempMap[id].push({
                                                id,
                                                name,
                                                question,
                                                title
                                            })
                                        }
                                    })

                                    for(const id in tempMap) {
                                        pollList.push(tempMap[id])
                                    }
                                })
                                .catch(err => {
                                    console.log(pollList);
                                    return res.status(500).json({
                                        message: err.message
                                    })
                                });

    return res.status(200).json({
        message:pollList
    })
})

voteRouter.post('/', (req, res) => {
    let name = req.body.name;
    let question = req.body.question;
    let options = req.body.option;

    connection.query('insert into poll(name, question) values(?, ?)', [name, question], (err, result) => {
        console.log("add poll");
    })

    let id;
    connection.query('select * from poll where name = ?', [name], async (err, result) => {
        id = result[0].id;

        options.forEach(option => {
            connection.query('insert into option(poll_id, title) values(?, ?)', [id, option], (err, result) => {
                console.log("add option");
            })
        });
    })


    return res.status(202).json({
        message: "Add success"
    })
})

voteRouter.put('/:id', (req, res) => {
    let name = req.body.name;
    let question = req.body.question;
    let options = req.body.option;

    connection.query('update poll set name = ?, question = ? where id = ?', [name, question, req.params.id], (req, res) => {
        console.log("update poll");
    })

    connection.query('delete from option where poll_id = ?', [req.params.id], (req, res) => {
        console.log("update poll");
    })

    options.forEach(option => {
        connection.query('insert into option(poll_id, title) values(?, ?)', [req.params.id, option], (err, result) => {
            console.log("add option");
        })
    });
    return res.status(202).json({
        message: "update success"
    })
})

voteRouter.delete('/:id', (req, res) => {
    connection.query('delete from poll where poll.id = ?', [req.params.id], (err, result) => {
        if(err){
            return res.status(500).json({
                message: err.message
            })
        }
        return res.status(202).json({
            message: "delete success"
        })
    })
})


voteRouter.post('/vote/:idoption', (req, res) => {
    const authorizationHeader = req.headers.authorization;
    console.log(authorizationHeader);
    
    try{    
        const isValidToken = jsonwebtoken.verify(authorizationHeader, process.env.JWT_SECRET);

        connection.query('insert into user_option(option_fk_id, user_fk_id) values(?, ?)', [req.params.idoption, isValidToken.id], (err, result) => {
            if(err){
                return res.status(500).json({
                    message: err.message
                })
            }
            return res.status(202).json({
                message: "added submit"
            })
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message   
        })
    }
})

voteRouter.delete('/vote/:idoption', (req, res) => {
    const authorizationHeader = req.headers.authorization;
    console.log(authorizationHeader);
    
    try{    
        const isValidToken = jsonwebtoken.verify(authorizationHeader, process.env.JWT_SECRET);

        connection.query('delete from user_option where option_fk_id = ? and user_fk_id = ?', [req.params.idoption, isValidToken.id], (err, result) => {
            if(err){
                return res.status(500).json({
                    message: err.message
                })
            }
            return res.status(202).json({
                message: "delete vote submit"
            })
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message   
        })
    }
})

module.exports = voteRouter;