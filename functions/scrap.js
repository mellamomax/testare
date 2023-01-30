const axios = require('axios');
const cheerio = require('cheerio');
const Table = require('cli-table');

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
const response = await axios.get('https://rpilocator.com/?cat=PI4');
const $ = cheerio.load(response.data);
const rows = $("#myTable tr").toArray().filter((row) => {
return $(row).attr("class") && ($(row).attr("class").split(" ").length !== 1 ||
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


const table = [headers, ...filteredTableData];

  
  
return { statusCode: 200, body: JSON.stringify({ message: table.toString(), value2 }) }

} catch (error) {
return {
statusCode: 500,
body: JSON.stringify({ error: error.toString() })
}
}
};

exports.handler = handler;
