const axios = require('axios');

const handler = async (event) => {
try {
const response = await axios.get('https://www.scrapethissite.com/pages/simple/');
const h1 = response.data.match(/<h1>(.*?)</h1>/)[1];
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
