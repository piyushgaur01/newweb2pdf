var express = require('express');
var screenshot = require('../server-controllers/screenshot');
var supercrawl = require('../server-controllers/supercrawl');
var utilities = require('../server-controllers/utilities');

var excludeTypes = ['css', 'js', 'png', 'gif', 'jpg', 'JPG',
  'pdf', 'zip', 'mp4', 'txt', 'ico'];

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


var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.render('index', { title: 'Express' });
});

router.post('/generatepdf', function (req, res, next) {
  var body = req.body;
  var urlsList = body.url.split(',');
  var devices = body.devices;
  let promiseArray = [];
  supercrawl.crawlingFunction(urlsList,function(urlsList){console.log(urlsList);
    configurations = configurations.filter((config) => {
      return devices.indexOf(config.name) > -1;
    });
    
  
    // return res.send(JSON.stringify(configurations));
   // filteredUrls = utilities.ArrNoDupe(urlsList);
  
    configurations.forEach((device) => {
      screenshot.screenshots(urlsList, device
		promiseArray.push(result);
		Promise.all(promiseArray)
    .then((results) => {
      console.log(results);
      return res.send(JSON.stringify(results));
    }));
		  
	  });
    });
  
    
  
  

  
 
  //  urlsList
  //    .then((success) => {
  //      console.log(success+'==============================================================');

  //     //  var filteredUrls = success.filter(function (e) {
  //     //    e = e.substring(e.length - 3);
  //     //    return excludeTypes.indexOf(e) < 0;
  //     //  });

  //      //console.log(filteredUrls);
  //      filteredUrls = utilities.ArrNoDupe(success);
  //      //filteredUrls = filteredUrls.slice(filteredUrls.length - 5);
  //      //return res.send(JSON.stringify(filteredUrls));

  //      configurations.forEach((device) => {
  //         promiseArray.push(screenshot.screenshots(filteredUrls, device));
  //      });
    
  //      Promise.all(promiseArray)
  //      .then((results) => {
  //        console.log(results);
  //        return res.send(JSON.stringify(results));
  //      })

  //    })
  //    .catch((error) => {
  //      console.log(error);
	// 	}); 

});

module.exports = router;
