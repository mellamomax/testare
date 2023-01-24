const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const app = express();

app.post('/scrape', (req, res) => {
  const url = req.body.url;
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);

      const title = $('h1').text();
      const description = $('p').text();

      res.json({ title, description });
    }
  });
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
const bodyParser = require('body-parser');

// parse application/json
app.use(bodyParser.json());
