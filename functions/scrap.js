const axios = require('axios');
const cheerio = require('cheerio');

const handler = async (event) => {
try {
const response = await axios.get('https://www.scrapethissite.com/pages/simple/');
const $ = cheerio.load(response.data);
const h1 = $('h1').text();
return {
statusCode: 200,
body: JSON.stringify({ message: h1 })
}
} catch (error) {
return {
statusCode: 500,
body: JSON.stringify({ error: error.toString() })
}
}
};

exports.handler = handler;
