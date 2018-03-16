var puppeteer = require('puppeteer');
var PDF = require('pdfkit');
var fs = require('fs');
var async = require('async');
const URL = require('url-parse');

var screenshotDir = './public/screenshots/';
var pdfDir = './public/PDF/';

exports.screenshots = function (urlList, device) {
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }

    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir);
    }

    urlList = urlList.map(item => item.trim());

    return new Promise(function (resolve, reject) {

        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setViewport({
                width: parseInt(device.size.width), 
                height: parseInt(device.size.height)
            });

            for (var i = 0; i < urlList.length; i++) {
                var urlFn = new URL(urlList[i]);
                if (!fs.existsSync(`${screenshotDir}/${urlFn.hostname}`)) {
                    fs.mkdirSync(`${screenshotDir}/${urlFn.hostname}`);
                }
                if (!fs.existsSync(`${screenshotDir}/${urlFn.hostname}/${device.name}`)) {
                    fs.mkdirSync(`${screenshotDir}/${urlFn.hostname}/${device.name}`);
                }
                await page.goto(urlList[i]);
                await page.screenshot({ path: `${screenshotDir}/${urlFn.hostname}/${device.name}/${(i + 1)}.png`, fullPage: true });

            }
            console.log('********ended*************');
            var ret = await pdfgenerator(urlList, device);
            //var ret = 'screenshots taken';
            await browser.close();
            resolve(ret);
        }
        )();

    })
}


function pdfgenerator(urlList, device) {
    //var urlFn = new URL(url);
    return new Promise(function (resolve, reject) {
        urlList.forEach(url => {
            var urlFn = new URL(url);
            var doc = new PDF({
                size: [1500, 1100]
            });
            var i = 1;
            doc.pipe(fs.createWriteStream(`${pdfDir}/${urlFn.hostname}.${device.name}.pdf`));

            i = i + 1;

            var dirPath = `${screenshotDir}/${urlFn.hostname}/${device.name}`;

            fs.readdir(dirPath, function (err, filesPath) {
                if (err) reject(err);

                filesPath = filesPath.map(function (filePath) {
                    return dirPath + "/" + filePath;
                });

                async.map(filesPath, function (err, filesPath) {
                    fs.readFile(err, filesPath);

                }, function (err, body) {
                    if (err) reject(err);

                    for (var i = 0; i < body.length; i++) {
                        doc.image(body[i], 0, 15, {
                            fit: [device.size.width, device.size.height],
                            align: 'center',
                            valign: 'center'
                        });
                        // doc.text('HOLIDAYS - 1 Fortime',80,165,{align:'TOP'});
                        // doc.text('Hello this is a demo file',100,200);
                        doc.addPage();
                    }

                    doc.end();
                    resolve(`PDF ${device.name} successful`);

                });
            });


        });
    });
}

