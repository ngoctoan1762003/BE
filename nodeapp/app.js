const express = require('express')
const app = express()
const port = 8081

const userRoute = require('./routes/user')

// Dùng userRoute cho tất cả các route bắt đầu bằng '/users'
app.use('/users', userRoute);
app.use(express.json())
app.use(express.urlencoded())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

