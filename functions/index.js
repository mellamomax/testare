const { spawnSync } = require('child_process');
const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

app.post('/', (req, res) => {
  // Use axios to make a POST request to the IFTTT webhook
  axios.post('https://maker.ifttt.com/trigger/send_notification/with/key/d_S45YgOUQspXBsB7VymKs', req.body)
    .then(response => {
      res.send(response.data)
    })
    .catch(error => {
      res.send(error)
    })
});

const handler = async (event) => {
  try {
    if (event.httpMethod === 'POST') {
      const result = spawnSync('node', ['server.js']);
      if (result.error) {
        console.error(`exec error: ${result.error}`);
        return { statusCode: 500, body: result.error.toString() }
      }
      if (result.stderr) {
        console.error(`stderr: ${result.stderr.toString()}`);
      }
      if (result.stdout) {
        console.log(`stdout: ${result.stdout.toString()}`);
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Server script is completed" }),
      };
    } else if (event.httpMethod === 'GET') {
      const subject = event.queryStringParameters.name || 'World'
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello ${subject} from get request` }),
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request method' }),
      }
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

exports.handler = handler;

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
