var puppeteer = require('puppeteer');
var PDF = require('pdfkit');
var fs = require('fs');
var async = require('async');
const URL = require('url-parse');
var pdfGenerator = require('../server-controllers/pdf-generator');
var screenshotDir = './public/screenshots/';
var pdfDir = './public/PDF/';

exports.crawlingFunction = function (url, urlArray, devices, res, i, callback1) {




  let desktop = {
    name: 'desktop',
    size: {
      width: 1366
      , height: 768
    }
  };

  let mobile = {
    name: 'mobile',
    size: {
      width: 375
      , height: 667
    }
  };

  let largeDesktop = {
    name: 'largeDesktop',
    size: {
      width: 1440
      , height: 900
    }
  };

  let ipad = {
    name: 'ipad',
    size: {
      width: 768
      , height: 1024
    }
  };

  let configurations = [mobile, ipad, desktop, largeDesktop];
  configurations = configurations.filter((config) => {
    return devices.indexOf(config.name) > -1;
  });

  configurations.forEach((device) => {
    screenshot(url, urlArray, device, res, i, function (status) {
      callback1(status);
    });
  });


}
var download_link = [];
function screenshot(url, urlArray, device, res, i, callback) {

  if (urlArray) {

    fs.readFile(`./websites/${url}/urls_list.txt`, 'utf8', function (err, data) {
      if (err) throw err;
      console.log(data);
      var obj = JSON.parse(data);


      console.log(obj);


      (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.setViewport({
            width: parseInt(device.size.width),
            height: parseInt(device.size.height)
          });
          var site = obj;
          console.log(site.length + '=================================== at 78');

          for (var i = 0; i < site.length; i++) {
            console.log(i);
            var URL = site[i];
            console.log(URL);
            await page.goto(URL, { waitUntil: 'load', timeout: 0 });
            if (!fs.existsSync(`${screenshotDir}/${url}`)) {
              fs.mkdirSync(`${screenshotDir}/${url}`);
            }
            if (!fs.existsSync(`${screenshotDir}/${url}/${device.name}`)) {
              fs.mkdirSync(`${screenshotDir}/${url}/${device.name}`);
            }
            await page.screenshot({ path: `${screenshotDir}/${url}/${device.name}/${(i + 1)}.png`, fullPage: true });

          }

          console.log('********ended*************');
          callback('done');
          // await pdfgenerator();
          await browser.close();
        }
        catch (e) {
          console.log(e + 'at line 101');
        }

      }
      )();



    })


  }

  else {
    var url1 = URL(url);

    (async () => {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
          width: parseInt(device.size.width),
          height: parseInt(device.size.height)
        });

        await page.goto(url, { waitUntil: 'load', timeout: 0 });
        if (!fs.existsSync(`${screenshotDir}/${url1.hostname}`)) {
          fs.mkdirSync(`${screenshotDir}/${url1.hostname}`);
        }
        if (!fs.existsSync(`${screenshotDir}/${url1.hostname}/${device.name}`)) {
          fs.mkdirSync(`${screenshotDir}/${url1.hostname}/${device.name}`);
        }
        await page.screenshot({ path: `${screenshotDir}/${url1.hostname}/${device.name}/${i}.png`, fullPage: true });


        await browser.close();
      }
      catch (e) {
        console.log(e + 'at line 101');
       
      }

    }
    )();

  }

}













