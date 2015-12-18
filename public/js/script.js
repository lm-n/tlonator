var numRequests;
var apiTermResponses = [];
var finaltextIsReady = false;
var loadtext = false;
var thetlontextcat;
var randomnumber; 
var thetlontext = "Their language and those things derived from their language—religion, literature, metaphysics—presuppose idealism. For the people of Tlön,the world is not an amalgam of objects in space; it is a heterogeneous series of independent acts the world is successive, temporal, but not spatial. There are no nouns in the conjectural Ursprache of Tlön,from which its present-day languages and dialects derive: there are impersonal verbs, modified by mono-syllabic suffixes (or prefixes) functioning as adverbs.";
var theDT;
var finaltext = "Click on the buttons to see examples of Tlönized English and learn more about the world of Tlön";

function replacef(apiTermResponses){
	finaltext = thetlontext;
	for (var i = 0; i < apiTermResponses.length; i++){
		var curToBeRepl = apiTermResponses[i][0];
		var curBecome = apiTermResponses[i][1];
		finaltext = finaltext.replace(curToBeRepl, curBecome);
	}
	console.log('textreplaced');
	finaltext = finaltext.replace(/\s\s/g,' ');
	console.log(finaltext);
	finaltextIsReady = true;
}

function getAPIDic(term, orderVal){
	$.ajax({
		url: "http://cors.io/?u=http://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + term + "?key=21960e29-e95e-456c-af22-7ff4c8b2fedb",
		type: 'GET',
		dataType: 'xml',
		error: function(data){
				alert("Oh No! Try a refresh?");
			},
		success: function(data){
			if (data.getElementsByTagName('dt')[0]){
				theDT = data.getElementsByTagName('dt')[0].textContent;
			}
			else{
				theDT = "";
			}

			var theNounArrayinDT = nlp.pos(theDT).nouns();
			var theTextArrayinDT = [];
			theNounArrayinDT.forEach(function(item){
			theTextArrayinDT.push(item.text);
			});

			for (var g = 0; g < theTextArrayinDT.length; g++){
				var curToBeRepl = theTextArrayinDT[g];
				theDT = theDT.replace(curToBeRepl, '');
			}

			for (var h = 0; h < replaceterms.length; h++){
				var curToBeRepla = replaceterms[h];
				theDT = theDT.replace(curToBeRepla, '');
			}

			var tempArray = [term, theDT];
			apiTermResponses.push(tempArray);
			if (apiTermResponses.length == numRequests){
				//console.log('allhere');
				replacef(apiTermResponses);
				//console.log(apiTermResponses);
				//console.log('readytoreplaceterms');
			}

			else{
				console.log("Not yet...");
			}
		}
	});
}

function nalapo(thetlontext){
	var theNounArray = nlp.pos(thetlontext).nouns();
	var theTextArray = [];
		theNounArray.forEach(function(item){
		theTextArray.push(item.text);
	});
	console.log(theTextArray);
	loadtext = true;
	numRequests = theTextArray.length;
	//console.log('allhere');
	theTextArray.forEach(function(item,i){
		var currentitem = item;
		for (var f = 0; f < replaceterms.length; f++){
			var curToBeRepl = replaceterms[f];
			currentitem = currentitem.replace(curToBeRepl, '');
		}
		//console.log('nalapodone');
		getAPIDic(currentitem,i);
	});
}

function getAPItexts(key){
	$.ajax({
		url: "/api/"+window.key,
		type: "GET",
		data: JSON,
		
		error: function(resp){
		},
		
		success: function (resp) {
			thetlontext = resp[randomnumber].doc.text;
			thetlontextcat = resp[randomnumber].doc.namespace;
			nalapo(thetlontext);
		},
	});
}

function pressfunc(){

	var btn = document.getElementById("geography");
	var btwn = document.getElementById("history");
	var btrn = document.getElementById("language");

	btn.onclick = function () {
		console.log('Hi, loading geography');
		resetGlobals();
		key = 'geography';
		getAPItexts(key);
	};

	btwn.onclick = function () {
		console.log('Hi, loading history');
		resetGlobals();
		key = 'history';
		getAPItexts(key);
	};

	btrn.onclick = function () {
		console.log('Hi, loading language');
		resetGlobals();
		key = 'language';
		getAPItexts(key);
	};
}

function resetGlobals(){
	apiTermResponses = [];
	thetlontext = 'Grabbing original text...';
	finaltext = 'Tlöning';
	randomnumber = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
}