const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

exports.handler = async (event, context) => {
  let browser = null;
  try {
    const executablePath = fs.existsSync(
      "/var/task/node_modules/puppeteer/.local-chromium/linux-608668/chrome-linux/chrome"
    )
      ? "/var/task/node_modules/puppeteer/.local-chromium/linux-608668/chrome-linux/chrome"
      : null;
  
  async function scrape() {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
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
        header === "Description" ||
        header === "Vendor" ||
        header === "Price"
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

    console.log(data[0]);

    await browser.close();
  }
  
  await scrape();
};
