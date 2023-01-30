const axios = require("axios");
const puppeteerCore = require('puppeteer-core');
const Table = require("cli-table");

const headers = [
"Description",
"Link",
"Update Status",
"Vendor",
"In Stock",
"Last Stock",
"Price",
];

const handler = async (event) => {
try {
const browser = await puppeteerCore.launch({
  executablePath: '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"'});
const page = await browser.newPage();
await page.goto("https://rpilocator.com/?cat=PI3");
const tableData = await page.evaluate(() => {
const rows = Array.from(
document.querySelectorAll("#myTable tr")
).filter((row) => {
return (
row.getAttribute("class") &&
(row.getAttribute("class").split(" ").length !== 1 ||
!["odd", "even"].includes(row.getAttribute("class").split(" ")[0]))
);
});
return rows.map((row) => {
const cells = Array.from(row.querySelectorAll("td"));
return cells.map((cell) =>
cell.classList.contains("text-center")
? cell.querySelector("a").getAttribute("href") || ""
: cell.textContent
);
});
});
const transposedData = [...headers].map((header, i) => [
header,
...tableData.map((row) => row[i]),
]);
// Exclude the "Link", "Update Status", "In Stock", and "Last Stock" columns from the table output
const filteredTableData = transposedData
.filter(
(row) =>
row[0] !== "Link" &&
row[0] !== "Update Status" &&
row[0] !== "In Stock" &&
row[0] !== "Last Stock"
)
.map((row) => row.slice(1));
// Assign the "Link" column to value2
const links = transposedData.find((row) => row[0] === "Link");
const value2 = links ? links[1] : "";

const table = [headers, ...filteredTableData];

await browser.close();

return {
statusCode: 200,
headers: {
"Content-Type": "text/plain; charset=utf-8",
},
body: headers.join("\n"),
};
} catch (error) {
return {
statusCode: 500,
body: JSON.stringify({ error: error.toString() }),
};
}
};

exports.handler = handler;
