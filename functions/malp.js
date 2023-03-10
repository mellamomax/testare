const chromeAwsLambda = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async (event, context, callback) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromeAwsLambda.args,
      executablePath: await chromeAwsLambda.executablePath,
      headless: chromeAwsLambda.headless,
    });

    const page = await browser.newPage();
    await page.goto("https://rpilocator.com/?cat=PI3");

    // Wait for the page to load the table
    await page.waitForSelector("#myTable");

    // Scrape the headers and all rows of the table
    const headers = await page.evaluate(() => {
      const headerCells = Array.from(
        document.querySelectorAll("#prodTable .thead-light th")
      );
      return headerCells.map((cell) => cell.innerText.trim());
    });

    const filteredHeaders = headers.filter(
      (header) =>
        header === "Description" || header === "Vendor" || header === "Price"
    );

    const rows = await page.evaluate(() => {
      const rowCells = Array.from(document.querySelectorAll("#myTable tr"));
      return rowCells
        .filter(
          (row) =>
            row.getAttribute("class") !== null &&
            row.getAttribute("class") !== "odd" &&
            row.getAttribute("class") !== "even"
        )
        .map((row) => {
          const cells = Array.from(row.querySelectorAll("td"));
          return cells
            .filter((cell, index) => index === 1 || index === 4 || index === 7)
            .map((cell) => cell.innerText.trim());
        });
    });

    // Format the data as desired
    const data = rows.map((row) => {
      return filteredHeaders.reduce((acc, header, index) => {
        return acc + `\n${header} - ${row[index]}`;
      }, "");
    });

    // Return the data in the response object
    const response = {
      statusCode: 200,
      body: JSON.stringify(data),
    };
    callback(null, response);
  } catch (error) {
    console.error(error);
    callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
