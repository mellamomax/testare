const puppeteer = require("puppeteer");

exports.handler = async (event, context) => {
    if(event.httpMethod === "POST"){
        let body;
        try {
            body = JSON.parse(event.body);
        } catch (err) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid JSON in request body" }),
            };
        }
        if (!body.url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing url property in request body" }),
            };
        }
        const url = body.url;
        let title;
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);
            title = await page.$eval("title", (el) => el.textContent);
            console.log(`Title: ${title}`);
            await browser.close();
        } catch (error) {
            console.log(error);
            return {
                statusCode: 400,
                body: JSON.stringify({ error }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ title }),
        };
    }else{
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Bad request, only POST method is accepted." }),
        };
    }
};
