var puppeteer = require('puppeteer');
var PDF = require('pdfkit');
var fs = require('fs');
var async = require('async');
const URL = require('url-parse');

var screenshotDir = './public/screenshots/';
var pdfDir = './public/PDF/';

exports.screenshots = function (urlList, width, height) {
    var urlFn = new URL(urlList[0]);
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }

    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir);
    }

    return new Promise(function (resolve, reject) {

    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: parseInt(width), height: parseInt(height) });

        for (var i = 0; i < urlList.length; i++) {
            var URL = urlList[i];
            await page.goto(URL);
            await page.screenshot({ path: screenshotDir + i + '.png', fullPage: true });

        }
        console.log('********ended*************');
        var ret = await pdfgenerator(urlFn.hostname, width);
        await browser.close();
        resolve(ret);
    }
    )();

    })
}


function pdfgenerator(filename, width) {
    //var urlFn = new URL(url);
    return new Promise(function (resolve, reject) {
        var doc = new PDF({
            size: [1100, 800]
        });
        var i = 1;
        doc.pipe(fs.createWriteStream(`${pdfDir}${filename}.${width}.pdf`));

        i = i + 1;

        var dirPath = screenshotDir;

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
                        fit: [1024, 768], 
                        align: 'center',
                        valign: 'center'
                    });
                    // doc.text('HOLIDAYS - 1 Fortime',80,165,{align:'TOP'});
                    // doc.text('Hello this is a demo file',100,200);
                    doc.addPage();
                }

                doc.end();
                resolve('PDF Generated successfully');

            });

        });
    });
}