const cheerio = require("cheerio");
const request = require("request");

exports.handler = async (event, context) => {
  const url = "https://rpilocator.com/?cat=PI4";
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const table = $(".mytable").html();
        resolve({
          statusCode: 200,
          body: JSON.stringify({ table }),
        });
      } else {
        reject({
          statusCode: 400,
          body: JSON.stringify({ error }),
        });
      }
    });
  });
};
