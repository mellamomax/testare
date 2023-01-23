const express = require('express')
const axios = require('axios')
const app = express()

app.use(express.json()) // to parse JSON bodies

app.post('/', (req, res) => {
  // Use axios to make a POST request to the IFTTT webhook
  axios.post('https://maker.ifttt.com/trigger/send_notification/with/key/d_S45YgOUQspXBsB7VymKs', req.body)
    .then(response => {
      res.send(response.data)
    })
    .catch(error => {
      res.send(error)
    })
})

exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: "Hello, World"
  });
}
