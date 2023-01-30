const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/scrap', (req, res) => {
console.log('Received POST request');
const url = req.body.url;
request(url, (error, response, html) => {
if (!error && response.statusCode == 200) {
console.log('Website successfully scraped');
const $ = cheerio.load(html);
const title = $('h1').text();
const description = $('p').text();
res.json({ title, description });
} else {
console.error('Failed to scrape website');
res.status(500).json({ error: 'Failed to scrape website' });
}
});
});

exports.handler = app;
