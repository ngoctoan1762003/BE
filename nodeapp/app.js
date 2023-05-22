const express = require('express')
const app = express()
const port = 8081

const userRoute = require('./routes/user')
const loginRoute = require('./routes/login')
const authRoute = require('./routes/auth')
const endRoute = require('./routes/endpoint')

// Dùng userRoute cho tất cả các route bắt đầu bằng '/users'
app.use(express.json())
app.use(express.urlencoded())
app.use('/users', userRoute);
app.use('/endpoint', endRoute);
//app.use('/login', loginRoute);
app.use('/auth', authRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

