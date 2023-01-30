const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/functions/scrap', (req, res) => {
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

exports.handler = app;
