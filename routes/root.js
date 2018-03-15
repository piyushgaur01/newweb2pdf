var express = require('express');
var screenshot = require('../server-controllers/screenshot');
var supercrawl = require('../server-controllers/supercrawl');
var utilities = require('../server-controllers/utilities');
var excludeTypes = ['css', 'js', 'png', 'gif', 'jpg', 'JPG',
  'pdf', 'zip', 'mp4', 'txt', 'ico'];

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.render('index', { title: 'Express' });
});

router.post('/generatepdf', function (req, res, next) {
  var body = req.body;
  var url = body.url;
  //var urlsList = supercrawl.crawlingFunction(url);
  var filteredUrls = [
    'https://www.lilly.se/SV/index.aspx',
    'https://www.lilly.se/sv/about/index.aspx',
    'https://www.lilly.se/sv/products/index.aspx'
  ];

  screenshot.screenshots(filteredUrls, 1024, 768)
    .then((response) => {
      console.log(response);
      return res.send(JSON.stringify(response));
    });

  // urlsList
  //   .then((success) => {
  //     //console.log(success);

  //     var filteredUrls = success.filter(function (e) {
  //       e = e.substring(e.length - 3);
  //       return excludeTypes.indexOf(e) < 0;
  //     });

  //     //console.log(filteredUrls);
  //     filteredUrls = utilities.ArrNoDupe(filteredUrls);
  //     filteredUrls = filteredUrls.slice(filteredUrls.length - 5);
  //     return res.send(JSON.stringify(filteredUrls));

  //     // screenshot.screenshots(filteredUrls, 1024, 768)
  //     // .then((response) => {
  //     //   console.log(response);
  //     //   return res.send(JSON.stringify(response));
  //     // });

  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   })

});

module.exports = router;
