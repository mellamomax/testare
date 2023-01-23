const puppeteer = require("puppeteer");

exports.handler = async (event, context) => {
    if(event.httpMethod === "POST"){
        const url = event.body.url;
        let div;
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);
            div = await page.$eval(".col-md-6.col-md-offset-3", (el) => el.outerHTML);
            await browser.close();
        } catch (error) {
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
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Bad request, only POST method is accepted." }),
        };
    }
};
