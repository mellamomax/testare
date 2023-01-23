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

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
