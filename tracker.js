//IMPORTS
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

// global configure
let url = 'https://www.amazon.com/Umbra-377601-656-Wobble-Chess-Brown/dp/B001A793IW/';
let wantedPrice = 100;
let senderemail = 'sender@email.com'
let senderpassword = null;
let useremail = null;

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
    let html = await page.evaluate(() => document.body.innerHTML);
    // console.log(html);

    let productName = null;

    $('#productTitle', html).each(function(){
        let productTitle = $(this).text();
        productName = productTitle.trim();
    })

    $('#priceblock_ourprice', html).each(function(){
        const dollarPrice = $(this).text();
        const currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g,""))

        console.log(productName+' is currently selling at'+dollarPrice)

        if (currentPrice <= wantedPrice){
            console.log(productName+' is now '+dollarPrice)
            sendNotification(currentPrice);
        }
    });
}

async function monitor() {
    let page = await configureBrowser ();
    await checkPrice(page);
}


async function startTracking() {
    const page = await configureBrowser();
    let job = new CronJob('*/15*****', function(){ // run every 15 second
        //startTrackingPrices();
        checkPrice(page);
    }, null, true, null, null, true);
    job.start();
}

// email configur
async function EmailNotification(price){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderemail,
            pass: senderpassword
        }
    });

    let emailText = productName+' is now $'+dollarPrice;
    let htmlText = `<a href=\"${url}\">Link</a>`;

    let info = await transporter.sendMail({
        from: "Amazon Price Tracker",
        to: useremail,
        subject: productName+' is now $'+dollarPrice,
        text: emailText,
        html: htmlText
    })
}

monitor();
