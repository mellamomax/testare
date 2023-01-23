const puppeteer = require("puppeteer");

exports.handler = async (event, context) => {
  const url = "https://rpilocator.com/?cat=PI4";
  let table;
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    table = await page.$eval("#myTable", (el) => el.outerHTML);
    await browser.close();
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ table }),
  };
};
