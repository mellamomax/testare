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

    // Create the table
    const table = new Table({
      head: headers,
      colWidths: [20, 20, 20, 20, 20, 20, 20]
    });

    // Add the data to the table
    tableData.forEach((rowData) => {
      table.push([rowData[0], rowData[1], rowData[2], rowData[3], rowData[4], rowData[5], rowData[6]]);
    });

    // Log the table to the console
    console.log(table.toString());

    return {
      statusCode: 200,
      body: JSON.stringify({ message: table.toString() })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() })
    };
  }
};

exports.handler = handler;
