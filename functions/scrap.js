const axios = require('axios');
const cheerio = require('cheerio');

const handler = async (event) => {
try {
const response = await axios.get('https://rpilocator.com/?cat=PI4');
const $ = cheerio.load(response.data);
const mytable = $('.mytable');
const rows = mytable.find('tr');
const firstThreeRows = [];
for (let i = 0; i < 3 && i < rows.length; i++) {
firstThreeRows.push(rows[i]);
}
return {
statusCode: 200,
body: JSON.stringify({ message: firstThreeRows })
}
} catch (error) {
return {
statusCode: 500,
body: JSON.stringify({ error: error.toString() })
}
}
};

exports.handler = handler;
