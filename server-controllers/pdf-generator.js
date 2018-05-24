var pdfDir = './public/PDF/';
var loc='public/PDF';
var screenshot = require('../server-controllers/screenshot');
var screenshotDir = './public/screenshots/';
var opn = require('opn');

exports.pdfgenerator = function (urlHostName, deviceName, res) {
  var PDF = require('pdfkit');
  var fs = require('fs');

  var fs = require('fs');
  var async = require('async');
  var doc = new PDF();
  var i = 1;
  doc.pipe(fs.createWriteStream(`${pdfDir}/${urlHostName}.${deviceName}.pdf`));

  i = i + 1;

  var dirPath = `${screenshotDir}/${urlHostName}/${deviceName}`;

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
        doc.image(body[i], 0, 15, { width: 500 });
        // doc.text('HOLIDAYS - 1 Fortime',80,165,{align:'TOP'});
        // doc.text('Hello this is a demo file',100,200);


        doc.addPage();
      }

      doc.end();
      console.log('success');
      opn(`http://w2p-web2pdf.paas-poc.am.lilly.com/../PDF/${urlHostName}.${deviceName}.pdf`)

    });

  });
}