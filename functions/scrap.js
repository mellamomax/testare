const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const app = express();

app.get('/scrape', (req, res) => {
  request('https://www.scrapethissite.com/pages/simple/', (error, response, html) => {
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
