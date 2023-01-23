const puppeteer = require("puppeteer");

exports.handler = async (event, context) => {
    console.log("Event:", event);
    console.log("Context:", context);
    if(event.httpMethod === "POST"){
        let body;
     try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        div = await page.$eval(".col-md-6.col-md-offset-3", (el) => el.outerHTML);
        await browser.close();
    } catch (error) {
        console.log(error)
        return {
            statusCode: 400,
            body: JSON.stringify({ error }),
        };
    }
        if (!body.url) {
            console.error("Missing url property in request body");
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing url property in request body" }),
            };
        }
        const url = body.url;
        let div;
        try {
            console.log("Scraping URL:", url);
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);
            div = await page.$eval(".col-md-6.col-md-offset-3", (el) => el.outerHTML);
            console.log("Scraped HTML:", div);
            await browser.close();
        } catch (error) {
            console.error("Error scraping website:", error);
            return {
                statusCode: 400,
                body: JSON.stringify({ error }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ div }),
        };
    }else{
        console.error("Bad request, only POST method is accepted.");
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Bad request, only POST method is accepted." }),
        };
    }
};
