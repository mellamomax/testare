const { exec } = require("child_process");
const server = require("./server");

const handler = async (event) => {
  try {
    if (event.httpMethod === "POST") {
      return new Promise((resolve, reject) => {
        exec("node server.js", (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            reject({ statusCode: 500, body: error.toString() });
          }
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
          resolve({
            statusCode: 200,
            body: JSON.stringify({ message: "Server script is running" }),
          });
        });
      });
    } else if (event.httpMethod === "GET") {
      const subject = event.queryStringParameters.name || "World";
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello ${subject} from get request` }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid request method" }),
      }
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

exports.handler = handler
