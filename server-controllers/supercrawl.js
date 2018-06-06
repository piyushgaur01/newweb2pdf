

var request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
var URL = require('url-parse');
var dotenv = require('dotenv');
const utilities = require('./utilities');
var screenshot = require('../server-controllers/screenshot');
var pdfGenerator = require('../server-controllers/pdf-generator');
var screenshotDir = './public/screenshots/';

var pdfDir = './public/PDF/';
var fse = require('fs-extra');

exports.crawlingFunction = function (Urls, devices, res) {
	console.log(Urls)


	START_URL = Urls.trim();
	const MAX_PAGES_TO_VISIT = 50;
	const urlFile = 'urls_list.txt';
	const excludeTypes = ['css', 'js', 'png', 'gif', 'jpg', 'JPG', 'pdf', 'zip', 'mp4', 'txt', 'ico', 'exe', 'ai'];
	let pagesVisited = {};
	let numPagesVisited = 0;
	let pagesToVisit = [];

	let url = new URL(START_URL);
	let baseUrl = url.protocol + "//" + url.hostname;
	let urlFilePath = './websites/' + url.hostname + '/' + urlFile;

	if (!fs.existsSync('./websites/')) {
		fs.mkdirSync('./websites/');
	} else {
		fse.emptyDirSync('./websites/')
	}


	if (!fs.existsSync(`./websites/${url.hostname}`)) {
		fs.mkdirSync(`./websites/${url.hostname}`);
	}
	else {
		fse.emptyDirSync(`./websites/${url.hostname}`)
	}

	if (!fs.existsSync(`${screenshotDir}`)) {
		fs.mkdirSync(`${screenshotDir}`);
	} else {
		fse.emptyDirSync(`${screenshotDir}`)
	}

	if (!fs.existsSync(`${pdfDir}`)) {
		fs.mkdirSync(`${pdfDir}`);
	}
	else {
		fse.emptyDirSync(`${pdfDir}`)
	}
	pagesToVisit.push(START_URL);
	crawl(-1);
	console.log("this is the end of first part");
	//

	function crawl(i) {
		pagesToVisit = utilities.ArrNoDupe(pagesToVisit);
		if (numPagesVisited >= MAX_PAGES_TO_VISIT) {

			fs.writeFile(urlFilePath, JSON.stringify(pagesToVisit), function (err) {
				if (err) {
					console.log(err);
				}
				else {

					//screenshot();
				}
			});
		}
		if (pagesToVisit.length >= 50) {

			fs.writeFile(urlFilePath, JSON.stringify(pagesToVisit), function (err) {
				if (err) {
					console.log(err);
				}
				else {


				}

			});
		}
		if (numPagesVisited < pagesToVisit.length) {
			let nextPage = pagesToVisit[numPagesVisited];
			if (nextPage in pagesVisited) {
				// We've already visited this page, so repeat the crawl
				crawl(i++);
			} else {
				// New page we haven't visited
				visitPage(nextPage, crawl, i);
			}
		}
		else {


			fs.writeFile(urlFilePath, JSON.stringify(pagesToVisit), function (err) {
				if (err) {
					console.log(err);
				}
				else {

					if (pagesToVisit.length < 10) {

						screenshot.crawlingFunction(url.hostname, true, devices, res, '', function (status) {
							console.log(status)
							pdfGenerator.pdfgenerator(url.hostname,devices, res);
						})
					} else {
						pdfGenerator.pdfgenerator(url.hostname,devices, res);
					}
				};

			});


		}

	}

	function visitPage(url, callback, i) {
		// Add page to our set
		pagesVisited[url] = true;
		numPagesVisited++;

		// Make the request
		console.log("Visiting page " + url);
		if (!url) {

			stream.once('open', function (fd) {
				pagesToVisit.forEach((url) => {
					stream.write(url);
					stream.write(',');
				});
				stream.end();
			});

		}
		else {
			var options = {
				method: 'get',
				url: url

			}
			try {
				request(options, function (error, response, body) {
					if (error) {
						console.log(error);
						throw error;
					}
					// Check status code (200 is HTTP OK)
					console.log("Status code: " + response.statusCode);
					if (response.statusCode !== 200) {
						pagesToVisit.pop(url);
						callback(i);

						return;
					} else {

						if (pagesToVisit.length > 10) {
							i++;
							screenshot.crawlingFunction(url, false, devices, res, i, function (status) { })
						}

					}
					// Parse the document body
					let $ = cheerio.load(body);

					collectInternalLinks($);

					callback(i++);

				});
			} catch (error) {
				console.log(error);
				callback(i);
			}
		}
	}



	function collectInternalLinks($) {
		let relativeLinks = $("a[href^='/']");
		if (!relativeLinks) {
			let relativeLinks = $("a[href^='']");
		}
		// console.log("Found " + relativeLinks + " relative links on page");
		relativeLinks.each(function () {
			let link = $(this).attr('href');

			let type = link.split('.');
			let linkUrl = new URL(link);


			type = type[type.length - 1];


			if (!(linkUrl.hostname)) {

				if ((excludeTypes.indexOf(type.toLowerCase()) < 0) &&
					(excludeTypes.indexOf(type.toUpperCase()) < 0) && (!link.startsWith('#')) && (!link.startsWith('javascript:void(0)'))) {
					if (link.startsWith('/')) {
						pagesToVisit.push(baseUrl + $(this).attr('href'));
					}
					else {
						pagesToVisit.push(baseUrl + '/' + $(this).attr('href'));
					}
				}
			}
		});

	}





}








