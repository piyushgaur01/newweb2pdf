var pdfDir = './public/PDF/';
var loc = 'public/PDF';
var screenshot = require('../server-controllers/screenshot');
var screenshotDir = './public/screenshots/';
var opn = require('opn');
var PDF = require('pdfkit');
var fs = require('fs');


var fs = require('fs');
var async = require('async');
var doc = new PDF();
exports.pdfgenerator = function (urlHostName,device, res) {
  if (!fs.existsSync(`${screenshotDir}/${device}`)) {
    var i = 1;
    doc.pipe(fs.createWriteStream(`${pdfDir}/${urlHostName}.${device}.pdf`)).on('finish', function () {
      console.log("Finished");
       opn(`http://localhost:3000/PDF/${urlHostName}.${device}.pdf`)
		res.send('done');
    });

    i = i + 1;

    var dirPath = `${screenshotDir}/${urlHostName}/${device}`;

    fs.readdir(dirPath, function (err, filesPath) {
      if (err) throw err;
      console.log(err);
      filesPath = filesPath.map(function (filePath) {
        console.log(dirPath + "/" + filePath);

        return dirPath + "/" + filePath;

      });
      async.map(filesPath, function (err, filesPath) {
        fs.readFile(err, filesPath);

      }, function (err, body) {
        if (err) throw err;


        console.log(body);
        console.log('added');
        for (var i = 0; i < body.length; i++) {
          doc.image(body[i], 0, 15, { width: 550, height: 700 });
          console.log(doc.addPage());
        }
		
		doc.end();

        console.log('success');

      });

    });
  }

}