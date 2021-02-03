//IMPORTS
const puppeteer = require('puppeteer');
const $ = require('cheerio');

// global configure
let url = 'https://www.amazon.com/Umbra-377601-656-Wobble-Chess-Brown/dp/B001A793IW/';
// let senderemail = 'sender@email.com'
// let senderpassword = null;
// let useremail = null;

// event listener
let button = document.getElementById("startBtn")
button.onclick = e => {
    window.alert('hi');
    monitor();
}


// create browser action
async function configureBrowser(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}
// check price in page
async function checkPrice(page) {
    await page.reload();
    // get all the elements within the website
    let html = await page.evaluate(() => document.body.innerHTML);
    // console.log(html);

    let productName = null;

    $('#productTitle', html).each(function(){
        let productTitle = $(this).text();
        productName = productTitle.trim();
    })

    $('#priceblock_ourprice', html).each(function(){
        let dollarPrice = $(this).text();
        // replace dollarsign with "" to get exact value
        var currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g,""))

        $('#display').innerHTML=currentPrice;

        if (currentPrice <= 100){
            console.log(productName+' is now $'+dollarPrice)
        }
    });
}

async function monitor() {
    let page = await configureBrowser ();
    await checkPrice(page);
}
