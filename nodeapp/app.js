const express = require('express')
const app = express()
const port = 8081

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
app.use(express.json())
app.use(express.urlencoded())
app.set('views', './views')

app.get('/', (req, res) => {
  res.send("oke")
})

app.get('/user', (req, res) => {
  res.status(200).send(users)
})

app.get('/user/:id', (req, res) => {
  let result = users.filter(user => 
    user.id.toString() === req.params.id
    )
  res.status(200).send(result)
})

app.put('/user/:id', (req, res) => {
  let index = 0
  while (req.params.id !== users[index].id.toString()){
    index++
  }
  users[index].fullname = req.body.fullname
  users[index].gender = req.body.gender
  users[index].age = req.body.age
  res.status(204)
})

app.post('/user', (req, res) => {
  console.log(req.body.id)
  let user = {
    "id": req.body.id,
    "fullname": req.body.fullname,
    "gender": req.body.gender,
    "age": req.body.age
  }
  users.push(user)
  res.status(201).send(users)
})

app.delete('/user/:id', (req, res) => {
  let index = 0
  while (req.params.id !== users[index].id.toString()){
    index++
  }
  users.splice(index, 1)
  res.status(204)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

