var numRequests;
var apiTermResponses = [];
var finaltextIsReady = false;
var loadtext = false;
var thetlontextcat;
var randomnumber;
var thetlontext = "Their language and those things derived from their language—religion, literature, metaphysics—presuppose idealism. For the people of Tlön,the world is not an amalgam of objects in space; it is a heterogeneous series of independent acts the world is successive, temporal, but not spatial. There are no nouns in the conjectural Ursprache of Tlön,from which its present-day languages and dialects derive: there are impersonal verbs, modified by mono-syllabic suffixes (or prefixes) functioning as adverbs.";
var theDT;
var finaltext = "Click on the buttons to see examples of Tlönized English and learn more about the world of Tlön";
var currentsentence;
var ritatestPOS;
var noundefinition;
var theRitaTextArray = [];
var dtplusPOSArray = [];
var defs = [];
var newTextArrays = [];
var termAndDef = [];
var nouns = [];

function replacef(termAndDef){
	finaltext = thetlontext;
	for (var i = 0; i < termAndDef.length; i++){
		var noun = termAndDef[i][0];
		var def = termAndDef[i][1];
		finaltext = finaltext.replace(noun, def);
	}
	finaltext = finaltext.replace(/\s\s/g,' ');
	finaltextIsReady = true;

	console.log(finaltext);
}

function textprocess(term){
	//console.log(term);
	$.ajax({
		url: '/dict/' + term,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			alert("Oh No! Try a refresh?");
			},
		success: function(data){
			//console.log(data);
			data = $.parseXML(data.theXML);
			//console.log(data);
			if (data.getElementsByTagName('dt')[0]){
				theDT = data.getElementsByTagName('dt')[0].textContent;
			}
			else{
				theDT = "";
			}
			dtplusPOSArray = [];
			tokenDT = [];
			dtPOS = [];
			//console.log(theDT);
			
			for (var h = 0; h < replaceterms.length; h++){
				var curToBeRepla = replaceterms[h];
				theDT = theDT.replace(curToBeRepla, '');
			}

			var tokenDT = RiTa.tokenize(theDT);//separate the definition into an array of words
			var dtPOS = RiTa.getPosTags(theDT);//get the parts of speech of each word

			for (var w = 0; w < tokenDT.length; w++){
				dtplusPOSArray.push([tokenDT[w], dtPOS[w]]); //populate the array with arrays made of each word and its part of speech
			}

			//console.log(dtplusPOSArray);
			defs = [];
			for (var v = 0; v < dtplusPOSArray.length; v++){
				if (dtplusPOSArray [v][1] == "nn" || dtplusPOSArray [v][1] == "nns" || dtplusPOSArray [v][1] == "nnp" || dtplusPOSArray [v][1] == "nnps" || dtplusPOSArray [v][1] == "prp" || dtplusPOSArray [v][1] == "prp$" ) {
					dtplusPOSArray [v][0] = '';
				}
				defs.push(dtplusPOSArray [v][0]);
			}
			noundefinition = RiTa.untokenize(defs);
			//console.log(noundefinition);
			termAndDef.push([term, noundefinition]);

			if (termAndDef.length == numRequests){
				console.log(termAndDef);
				replacef(termAndDef);
			}
		}
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
			ritatestPOS = RiTa.getPosTags(thetlontext); //analize each sentence and indicate the part of speech of each word
			tlonwords = RiTa.tokenize(thetlontext); //separate the sentence into words
			for (var y = 0; y < tlonwords.length; y++){
				theRitaTextArray.push([tlonwords[y], ritatestPOS[y]]); //populate the array with arrays made of each word and its part of speech
			}
			//console.log(theRitaTextArray);
			for (var x = 0; x < theRitaTextArray.length; x++){
				if (theRitaTextArray[x][1] == "nn" || theRitaTextArray[x][1] == "nns" || theRitaTextArray[x][1] == "nnp" || theRitaTextArray[x][1] == "nnps" || theRitaTextArray[x][1] == "prp" || theRitaTextArray[x][1] == "prp$") {
					currentitem = theRitaTextArray[x][0];
					textprocess(currentitem,x);
					nouns.push(currentitem);
				}
			}
			numRequests = nouns.length;
		},
	});
}

function pressfunc(){

	var btn = document.getElementById("geography");
	var btwn = document.getElementById("history");
	var btrn = document.getElementById("language");

	btn.onclick = function () {
		//console.log('Hi, loading geography');
		resetGlobals();
		key = 'geography';
		getAPItexts(key);
	};

	btwn.onclick = function () {
		//console.log('Hi, loading history');
		resetGlobals();
		key = 'history';
		getAPItexts(key);
	};

	btrn.onclick = function () {
		//console.log('Hi, loading language');
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