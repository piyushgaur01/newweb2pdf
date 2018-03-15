var express = require('express');
var router = express.Router();
var supercrawl = require('../server-controllers/supercrawl');
var utilities = require('../server-controllers/utilities');
var excludeTypes = ['css', 'js', 'png', 'gif', 'jpg', 'JPG',
  'pdf', 'zip', 'mp4', 'txt', 'ico'];

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.render('index', { title: 'Express' });
});

router.post('/generatepdf', function (req, res, next) {
  var body = req.body;
  var url = body.url;
  var urlsList = supercrawl.crawlingFunction(url);
  urlsList
    .then((success) => {
      //console.log(success);

      var intersection = success.filter(function (e) {
        e = e.substring(e.length-3);
        return excludeTypes.indexOf(e) < 0;
      });

      console.log(intersection);
      intersection = utilities.ArrNoDupe(intersection);
      return res.send(JSON.stringify(intersection));
    })
    .catch((error) => {
      console.log(error);
    })

});

module.exports = router;
