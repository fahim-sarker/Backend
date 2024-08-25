const express = require('express')
const app = express()
const port = 3000



app.get('/', (req, res) => {
    res.send('Hello Worldoo22o111!')
  })

const users = [
    {name:"fahim",email:"sarkerfahim599@gmail.com",description:"fahim sarker"},
    {name:"sahed",email:"sarkerfahim599@gmail.com",description:"fahim sarker"},
    {name:"miraz",email:"sarkerfahim599@gmail.com",description:"fahim sarker"},
    {name:"rifat",email:"sarkerfahim599@gmail.com",description:"fahim sarker"},
    {name:"rahmatullah",email:"sarkerfahim599@gmail.com",description:"fahim sarker"}
]
app.get('/user', (req, res) => {
    res.send(users)
  })



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })