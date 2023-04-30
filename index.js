// const jsonwebtoken = require('jsonwebtoken');
// const secret = 'secret'
// const user = {
//     name: "A",
//     uername: "sgroup",
//     password: "sgroupvn123",
//     email: "sgroup@gmail.com",
//     age: 24,
//     balance: "5000000",
//     gender: "male"
// };

// // const jwtpayload = {
// //     name: user.name,
// //     ussernme: user.usernme,
// //     email: user.email,
// //     age: user.age,
// //     gender: user.gender    
// // };

// // const jwt = jsonwebtoken.sign(jwtpayload, secret,{
// //     algorithm: 'HS256', //thuat toan hash(header+payload, secret)
// //     expiresIn: '120ms',
// //     issuer: 'sgroup'
// // });
// // console.log(jwt)

// const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQSIsImVtYWlsIjoic2dyb3VwQGdtYWlsLmNvbSIsImFnZSI6MjQsImdlbmRlciI6Im1hbGUiLCJpYXQiOjE2ODE4MjYwMzQsImV4cCI6MTY4MTgyNjAzNCwiaXNzIjoic2dyb3VwIn0.OrqKqucMDkJosmWyls50_ISyU-z7Hg9PyMBV3NC-3q4'

// const isValidToken = jsonwebtoken.verify(userToken, secret)

// console.log(isValidToken)