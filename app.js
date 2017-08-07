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

/* ----
ROUTES
-----*/
app.get("/", function (request, response) {
	console.log("In main route");
	response.render('index', {title: "Tlon"});
});

app.get("/dict/:term" , function (request, response) {
	var theTerm = request.params.term;
	//console.log('Making a dict request for term ' + theTerm);
	var theURL = "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + theTerm + "?key=21960e29-e95e-456c-af22-7ff4c8b2fedb";
	Request.get(theURL,function(err, res, body){
		if (!err && res.statusCode == 200){
			response.json({theXML: body});
		}
		else{
			//console.log("Problems...");
			response.json({theXML: "nope"});
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
