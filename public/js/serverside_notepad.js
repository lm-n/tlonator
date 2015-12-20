var noteTemplate = function (data) {
	template = '<div class="note">';
	template += new Date(data.created_at);
	template += '<h3>'+ data.title +'</h3>';
	template += '<div>'+ data.text +'</div>';
	template += '</div>';

	return template;
};

function saveRecord (theData) {
	theData.namespace = window.key;
	console.log("Trying to Post");
	$.ajax({
		url: "/save",
		contentType: "application/json",
		type: "POST",
		data: JSON.stringify(theData),
		error: function (resp) {
			console.log(resp);
			$("#new-note").prepend("<p><strong>Something broke.</strong></p>");
		},
		success: function (resp) {
			console.log(resp);
			var htmlString = noteTemplate(theData);
			$("#notes").append(htmlString);
			$("#note-title").val("");
			$("#note-text").val("");
			$("#note-submit").blur();
		}
	});
}


function loadNotes() {
	$.ajax({
		url: "/api/"+window.key,
		type: "GET",
		data: JSON,
		error: function(resp){
			console.log(resp);
		},
		success: function (resp) {
			console.log(resp);
			$("#notes").empty();

			if (resp.noData){
				return;
			}
			var sorted = _.sortBy(resp, function (row) { return row.doc.created_at;});
			sorted.forEach(function (row) {
				var htmlString = noteTemplate(row.doc);
				$('#notes').append(htmlString);
			});
		}
	});
}

$(document).ready(function(){
	console.log("Loaded!");
	loadNotes();

	$("#new-note").submit(function () {
		var noteData = {
			title: $("#note-title").val(),
			text: $("#note-text").val(),
			created_at: new Date()
		};
		saveRecord(noteData);
		return false;
	});
});