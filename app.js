var express = require('express');
var Request = require('request');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;


app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* ---------
DATABASE Configuration
----------*/
var CLOUDANT_USERNAME="lmn297";
var CLOUDANT_DATABASE="tlontexts";
var CLOUDANT_KEY="tiaegantiedideethedoings";
var CLOUDANT_PASSWORD="26991b75193f6bd5f2b10de1fe04d674eb8b0162";

var CLOUDANT_URL = "https://" + CLOUDANT_USERNAME + ".cloudant.com/" + CLOUDANT_DATABASE;

/* ----
ROUTES
-----*/
app.get("/", function (request, response) {
	console.log("In main route");
	response.render('index', {title: "Tlon"});
});

app.post("/save", function (request, response) {
	console.log("Making a post!");
	Request.post({
		url: CLOUDANT_URL,
		auth: {
			user: CLOUDANT_KEY,
			pass: CLOUDANT_PASSWORD
		},
		json: true,
		body: request.body
	},
	function (err, res, body) {
		if (res.statusCode == 201){
			console.log('Doc was saved!');
			response.json(body);
		}
		else{
			console.log('Error: '+ res.statusCode);
			console.log(body);
		}
	});
});

app.get("/api/:key" , function (request, response) {
	var theNamespace = request.params.key;
	console.log('Making a db request for namespace ' + theNamespace);
	Request.get({
		url: CLOUDANT_URL+"/_all_docs?include_docs=true",
		auth: {
			user: CLOUDANT_KEY,
			pass: CLOUDANT_PASSWORD
		},
		json: true
	}, function (err, res, body){
		var theData = body.rows;
		if (theData){
			var filteredData = theData.filter(function (d) {
				return d.doc.namespace == request.params.key;
			});
			response.json(filteredData);
		}
		else{
			response.json({noData:true});
		}
	});
});

app.get("/:key", function (request, response) {
	console.log("In key...");
	response.render('notes',{title: "Tlon", key: request.params.key});
});

app.get("*", function(request,response){
	response.send("Sorry, nothing to see here.");
});

app.listen(port);
console.log('Express started on port' + port);