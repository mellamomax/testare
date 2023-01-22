const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.json())

app.post('/', (req, res) => {
  // Handle the post request here
  console.log(req.body)
  res.send('Hello World')
})