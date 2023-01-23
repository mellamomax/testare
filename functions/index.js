const handler = async (event) => {
const puppeteer = require("puppeteer");
try {
const getTableValues = async () => {
const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.goto("https://rpilocator.com/?cat=PI4");
await page.waitForSelector("#myTable");

  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("#myTable tr")).filter(
      (row) =>
        row.classList.length !== 1 ||
        !["odd", "even"].includes(row.classList[0])
    );
    return rows.map((row) => {
      const cells = Array.from(row.querySelectorAll("td"));
      return cells.map((cell) =>
        cell.classList.contains("text-center")
          ? cell.querySelector("a")
            ? cell.querySelector("a").getAttribute("href")
            : ""
          : cell.textContent
      );
    });
  });

  const transposedData = [...headers].map((header, i) => [
    header,
    ...data.map((row) => row[i + 1]),
  ]);

  // Exclude the "Link", "Update Status", "In Stock", and "Last Stock" columns from the table output
  const tableData = transposedData
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

  console.log(table(transposedData));

  await browser.close();

  return { tableData, value2 };
}
const postToIFTTTWebhook = async (body) => {
   await axios.post('https://maker.ifttt.com/trigger/send_notification/with/key/d_S45YgOUQspXBsB7VymKs', body);
}
const { tableData, value2 } = await getTableValues();
const tableOutput = table(tableData, {
    hsep: " | ",
    stringLength: (str) => str.length,
});
await postToIFTTTWebhook({ value1: tableOutput, value2 });
return {
    statusCode: 200,
    body: JSON.stringify({ message: "Successfully sent data to IFTTT webhook" })
}
} catch (error) {
return {
statusCode: 500,
body: JSON.stringify({ error: error.toString() })
}
}
}
exports.handler = handler;
