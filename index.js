const express = require('express')
const app = express()
const port = 3000;
const bodyParser = require('body-parser');

const puppeteer = require("puppeteer");



app.use(bodyParser.json());
app.set('json spaces', 2);
app.get('/', (req, res) => {
    res.json("Simple Express APP");
})
app.get('/*/*', async (req, res, next) => {
    var url = req.params[0];
    var tag = req.params[1];

    try {
        // open the headless browser
        var browser = await puppeteer.launch({
            headless: false
        });
        // open a new page
        var page = await browser.newPage();
        page.on('console', msg => console.log(msg.text));

        await page.goto(url);
        await page.waitForSelector(tag);

        var stylesheet = await page.evaluate((tag) => {

            var titleNodeList = document.querySelectorAll(tag);
            var styleArray = [];
            for (var i = 0; i < titleNodeList.length; i++) {

                var theCSSObj = window.getComputedStyle(titleNodeList[i], null);

                var finalObj = {}
                for (key in theCSSObj) {
                    var cssObjProp = theCSSObj[key];
                    finalObj[cssObjProp] = theCSSObj.getPropertyValue(cssObjProp);

                }
                styleArray[i] = {
                    ...finalObj
                };



            }
            return styleArray;
        }, tag);
        res.json(stylesheet);

        await browser.close();
        console.log("Browser Closed p1");
    } catch (err) {
        console.log(err, "p");
        await browser.close();
        console.log("Browser Closed p2");
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))