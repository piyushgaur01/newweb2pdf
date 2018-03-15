var Crawler = require("simplecrawler");
var cheerio = require('cheerio');

var crawler = new Crawler('https://www.lilly.it/it/index.aspx');
crawler.respectRobotsTxt=false;
//crawler.domainWhitelist = ['www.lilly.it']
crawler.maxConcurrency = 3;
crawler.maxDepth = 3;
crawler.interval = 250;

crawler.discoverResources = function(buffer, queueItem) {
  var $ = cheerio.load(buffer.toString("utf8"));

  return $("a[href]").map(function () {
      return $(this).attr("href");
  }).get();
};

crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
  console.log("Fetched", queueItem.url, responseBuffer.toString());
});


crawler.on("complete", function() {
  console.log(crawler);
  console.log("Finished!");

});

crawler.start();