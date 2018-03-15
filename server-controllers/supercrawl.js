
exports.crawlingFunction = function (startUrl) {
    return new Promise(function (resolve, reject) {
        var supercrawler = require("supercrawler");
        var urlList = [];
        var excludeTypes = ['css', 'js', 'png', 'gif', 'jpg', 'JPG',
            'pdf', 'zip', 'mp4', 'txt', 'ico', 'txt', 'rar'];

        var crawler = new supercrawler.Crawler({
            interval: 100,
            concurrentRequestsLimit: 5
        });

        crawler.on("crawlurl", function (url) {
            console.log("Crawling " + url);
            urlList.push(url);
        });

        crawler.on("urllistcomplete", function () {
            console.warn("the URL list is permanently empty.");
            console.log(urlList);
            crawler.stop();
            return resolve(urlList);
        });

        crawler.on("handlersError", function (err) {
            console.error(err);
            return reject(err);
        });
        crawler.addHandler("text/html", supercrawler.handlers.htmlLinkParser({
            // Restrict discovered links to the following hostnames.
            hostnames: ["sweetpricing.com"]
        }));


        crawler.getUrlList().insertIfNotExists(new supercrawler.Url({
            url: startUrl
        })).then(function () {
            crawler.start();
        });
    })

}
