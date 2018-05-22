
var request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
var URL = require('url-parse');
var dotenv = require('dotenv');
const utilities = require('./utilities');
 var screenshot = require('../server-controllers/screenshot');
exports.crawlingFunction=function(Urls,devices,res){
  	console.log(Urls)
	Urls.forEach((START_URL) =>{
		
		const MAX_PAGES_TO_VISIT = 150;
		const urlFile = 'urls_list.txt';  
		const excludeTypes = ['css', 'js', 'png', 'gif', 'jpg', 'JPG','pdf', 'zip', 'mp4', 'txt', 'ico'];
		let pagesVisited = {};
		let numPagesVisited = 0;
		let pagesToVisit = [];

			let url = new URL(START_URL);
			let baseUrl = url.protocol + "//" + url.hostname;
			let urlFilePath = './websites/' + url.hostname + '/' + urlFile;
					
			if (!fs.existsSync('./websites/')) {
				fs.mkdirSync('./websites/');
			}
			if (!fs.existsSync('./../PDF/')) {
				fs.mkdirSync('./../PDF/');
			}

  if (!fs.existsSync(`./websites/${url.hostname}`)) {
    fs.mkdirSync(`./websites/${url.hostname}`);
  }

  pagesToVisit.push(START_URL);
  crawl();
  console.log("this is the end of first part");
  //

  function crawl() {
    pagesToVisit = utilities.ArrNoDupe(pagesToVisit);
    if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
      console.log("Reached max limit of number of pages to visit.");
      fs.writeFile(urlFilePath, JSON.stringify(pagesToVisit), function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("Output... saved to /urls.txt at line 50");
          //screenshot();
        }
      });
    }
    if (pagesToVisit.length >= 50) {
      console.log("Pages to visit array size threshold hit.");
      fs.writeFile(urlFilePath, JSON.stringify(pagesToVisit), function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("Output.saved to /urls.txt at line 62");
         
        }
        
      });
    }
    if (numPagesVisited < pagesToVisit.length) {
      let nextPage = pagesToVisit[numPagesVisited];
      if (nextPage in pagesVisited) {
        // We've already visited this page, so repeat the crawl
        crawl();
      } else {
        // New page we haven't visited
        visitPage(nextPage, crawl);
      }
    }
    else {
      console.log('End of array reached');

      fs.writeFile(urlFilePath, JSON.stringify(pagesToVisit), function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("Output.. saved to /urls.txt at line 86");
		  screenshot.crawlingFunction(url.hostname,devices,res)
			
        };
        
      });

      console.log("ITS THE ENDING");
    }

  }

  function visitPage(url, callback) {
    // Add page to our set
    pagesVisited[url] = true;
    numPagesVisited++;

    // Make the request
    console.log("Visiting page " + url);
    if (!url) {
      console.log('url not defined', url);
      stream.once('open', function (fd) {
        pagesToVisit.forEach((url) => {
          stream.write(url);
          stream.write(',');
        });
        stream.end();
      });
      return res.send(JSON.stringify(pagesToVisit));
    }
	var options={
		method:'get',
		url:url,
		proxy:'http://proxy.gtm.lilly.com:9000'
	}
    request(options, function (error, response, body) {
      if (error) {
        console.log(error);
        throw error;
      }
      // Check status code (200 is HTTP OK)
      console.log("Status code: " + response.statusCode);
      if (response.statusCode !== 200) {
		  pagesToVisit.pop(url);
        callback();
		
        return;
      }
      // Parse the document body
      let $ = cheerio.load(body);
    
      collectInternalLinks($);

      callback();
     
    });
  }

  

  function collectInternalLinks($) {
    let relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function () {
      let link = $(this).attr('href');
      let type = link.split('.');
      let linkUrl = new URL(link);
      type = type[type.length - 1];
      console.log(link);
      console.log(link.hostname);
      if (!(linkUrl.hostname)) {
        console.log('no hostname found');
        if ((excludeTypes.indexOf(type.toLowerCase()) < 0) &&
          (excludeTypes.indexOf(type.toUpperCase()) < 0)) {
          pagesToVisit.push(baseUrl + $(this).attr('href'));
        }
      }
    });
    console.log('=======================================');
  }
			
		})

	
	
} 


 
 
 
 

  	
