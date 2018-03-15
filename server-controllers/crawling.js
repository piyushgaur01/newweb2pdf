const utilities = require('./utilities');

module.exports = crawl;

function crawl(requestedUrl) {
    console.log(requestedUrl);
    const START_URL = requestedUrl;
    //const SEARCH_WORD = "stemming";
    const MAX_PAGES_TO_VISIT = 50; // Hard-limit to restrict number of pages
    const excludeTypes = ['css', 'js', 'png', 'gif', 'jpg', 'JPG',
        'pdf', 'zip', 'mp4', 'txt', 'ico'];

    let urls = [];
    let stream = fs.createWriteStream("urls.txt");
    let pagesVisited = {};
    let numPagesVisited = 0;
    let pagesToVisit = [];
    let url = new URL(START_URL);
    let baseUrl = url.protocol + "//" + url.hostname;
    let urlFilePath = './websites/' + url.hostname + '/' + urlFile;

    if (!fs.existsSync('./websites/')) {
        fs.mkdirSync('./websites/');
      }
    
      if (!fs.existsSync('./public/PDF/')) {
        fs.mkdirSync('./public/PDF/');
      }
    
      if (!fs.existsSync(`./websites/${url.hostname}`)) {
        fs.mkdirSync(`./websites/${url.hostname}`);
      }

      if (!fs.existsSync(`./websites/${url.hostname}/screens`)) {
        fs.mkdirSync(`./websites/${url.hostname}/screens/`);
      }
    
      pagesToVisit.push(START_URL);
      pagesToVisit = utilities.ArrNoDupe(pagesToVisit);

      if (numPagesVisited < pagesToVisit.length) {
        let nextPage = pagesToVisit[numPagesVisited];
        if (!(nextPage in pagesVisited)) {
          visitPage(nextPage, crawl);
        }
      }

    return urls;
}

function visitPage(url, callback) {
    // Add page to our set
    pagesVisited[url] = true;
    numPagesVisited++;

    // Make the request
    console.log("Visiting page " + url);
    // if (!url) {
    //   console.log('url not defined', url);
    //   stream.once('open', function (fd) {
    //     pagesToVisit.forEach((url) => {
    //       stream.write(url);
    //       stream.write(',');
    //     });
    //     stream.end();
    //   });
    //   return res.send(JSON.stringify(pagesToVisit));
    // }
    request(url, function (error, response, body) {
      if (error) {
        console.log(error);
        throw error;
      }
      // Check status code (200 is HTTP OK)
      console.log("Status code: " + response.statusCode);
      if (response.statusCode !== 200) {
        callback();
        return;
      }
      // Parse the document body
      let $ = cheerio.load(body);
      //  var isWordFound = searchForWord($, SEARCH_WORD);
      //  if(isWordFound) {
      //    console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
      //  } else {
      collectInternalLinks($);
      // In this short program, our callback is just calling crawl()
      callback();
      //  }
    });
  }