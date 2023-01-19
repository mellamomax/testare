const express = require("express");
const app = express();
const table = require("text-table");
const puppeteer = require("puppeteer");
const axios = require("axios");

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
        row[0
