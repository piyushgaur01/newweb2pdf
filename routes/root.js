var express = require('express');
var screenshot = require('../server-controllers/screenshot');
var supercrawl = require('../server-controllers/supercrawl');
var utilities = require('../server-controllers/utilities');

var excludeTypes = ['css', 'js', 'png', 'gif', 'jpg', 'JPG',
  'pdf', 'zip', 'mp4', 'txt', 'ico'];




var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.render('index', { title: 'Web-to-Pdf' });
});

router.post('/generatepdf', function (req, res, next) {
  var body = req.body;
  console.log(body);
  var url = body.url;
  
  var devices = body.devices;
  let promiseArray = [];
  supercrawl.crawlingFunction(url,devices,res);
  
  
  
  
 

  


  

  // urlsList
  //   .then((success) => {
  //     //console.log(success);

  //     var filteredUrls = success.filter(function (e) {
  //       e = e.substring(e.length - 3);
  //       return excludeTypes.indexOf(e) < 0;
  //     });

  //     //console.log(filteredUrls);
  //     filteredUrls = utilities.ArrNoDupe(filteredUrls);
  //     //filteredUrls = filteredUrls.slice(filteredUrls.length - 5);
  //     //return res.send(JSON.stringify(filteredUrls));

  //     configurations.forEach((device) => {
  //       promiseArray.push(screenshot.screenshots(filteredUrls, device));
  //     });
    
  //     Promise.all(promiseArray)
  //     .then((results) => {
  //       console.log(results);
  //       return res.send(JSON.stringify(results));
  //     })

  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

});

module.exports = router;
