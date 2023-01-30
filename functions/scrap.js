const axios = require("axios");
const cheerio = require("cheerio");
const table = require("text-table");

const headers = [
"Description",
"Link",
"Update Status",
"Vendor",
"In Stock",
"Last Stock",
"Price",
];

async function getTableValues() {
const { data } = await axios.get("https://rpilocator.com/?cat=PI4");
const $ = cheerio.load(data);
const rows = $("#myTable tr").toArray().filter((row) => {
return (
$(row).attr("class").split(" ").length !== 1 ||
!["odd", "even"].includes($(row).attr("class").split(" ")[0])
);
});
const tableData = rows.map((row) => {
const cells = $(row)
.find("td")
.toArray();
return cells.map((cell) =>
$(cell).hasClass("text-center")
? $(cell)
.find("a")
.attr("href") || ""
: $(cell).text()
);
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
console.log(table.table(transposedData));
return { tableData: filteredTableData, value2 };
}

getTableValues().then(console.log).catch(console.error);
