const express = require('express');
const user_router = express.Router();

user_router.use(express.json())
user_router.use(express.urlencoded())

const validate = require('../middleware/validate')

let users = [
    {
      "id": 1,
      "fullname": "Nguyen Huy Tuong",
      "gender": true,
      "age": 18
    },
    {
      "id": 2,
      "fullname": "Nguyen Thi Tuong",
      "gender": false,
      "age": 15
    }
  ]
  

  user_router.get('/', (req, res) => {
    res.status(200).send(users)
  })
  
  user_router.get('/:id', (req, res) => {
    let result = users.filter(user => 
      user.id.toString() === req.params.id
      )
    res.status(200).send(result)
  })
  
  user_router.put('/:id', validate, (req, res) => {
    let index = 0
    while (req.params.id !== users[index].id.toString()){
      index++
    }
    users[index].fullname = req.body.fullname
    users[index].gender = req.body.gender
    users[index].age = req.body.age
    res.status(204).send()
  })
  
  user_router.post('/', validate, (req, res) => {
    let user = {
      "id": users[users.length-1].id + 1,
      "fullname": req.body.fullname,
      "gender": req.body.gender,
      "age": req.body.age
    }
    users.push(user)
    res.status(201).send(users)
  })
  
  user_router.delete('/:id', validate, (req, res) => {
    let index = 0
    while (req.params.id !== users[index].id.toString() && index < users.length){
      index++
      
    }
    if(index < users.length) 
    {
        users.splice(index, 1)
        res.status(204).send()
    }
    else
    {
        res.status(404).send("Error")
    }
  })
  // Exports cho biến user_router
module.exports = user_router;
