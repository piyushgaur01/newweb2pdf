var puppeteer = require('puppeteer');
var PDF = require('pdfkit');
var fs = require('fs');
var async = require('async');
const URL = require('url-parse');
var pdfGenerator = require('../server-controllers/pdf-generator');
var screenshotDir = './public/screenshots/';
var pdfDir = './../PDF/';

exports.crawlingFunction=function(urlHostName,devices,res){

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

let configurations = [mobile,ipad,desktop,largeDesktop];
configurations = configurations.filter((config) => {
    return devices.indexOf(config.name) > -1;
  });
  
configurations.forEach((device) => {
    screenshot(device,urlHostName,res);
  });


}
var download_link=[];
function screenshot(device,urlHostName,res) {
    var fs = require('fs');
  
    var puppeteer = require('puppeteer');
    fs.readFile(`./websites/${urlHostName}/urls_list.txt`, 'utf8', function (err, data) {
      if (err) throw err;
      console.log(data);
      var obj = JSON.parse(data);
  
  
      console.log(obj);
  
  
      (async () => {
		  try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
                width: parseInt(device.size.width), 
                height: parseInt(device.size.height)
            });
        var site = obj;
        console.log(site.length+'=================================== at 78');
  
        for (var i = 0; i < site.length; i++) {
          console.log(i);
          var URL = site[i];
          console.log(URL);
          await page.goto(URL);
		  if (!fs.existsSync(`${screenshotDir}/${urlHostName}`)) {
                    fs.mkdirSync(`${screenshotDir}/${urlHostName}`);
                }
                if (!fs.existsSync(`${screenshotDir}/${urlHostName}/${device.name}`)) {
                    fs.mkdirSync(`${screenshotDir}/${urlHostName}/${device.name}`);
                }
          await page.screenshot({ path: `${screenshotDir}/${urlHostName}/${device.name}/${(i + 1)}.png`, fullPage: true });
  
        }
		
        console.log('********ended*************');
		pdfGenerator.pdfgenerator(urlHostName,device.name,res);
       // await pdfgenerator();
        await browser.close();
      }
	  catch(e){
		  console.log(e);
	  }
	  
	  }
      )();
  
    
  
	})}
	//res.send('PDF will be generation is in ')












