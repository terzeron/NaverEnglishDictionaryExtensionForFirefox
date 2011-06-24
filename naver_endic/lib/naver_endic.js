// Import the APIs we need.
var request = require("request");

// Define the 'search' function using Request
function search(text, callback) {
	if (text.length == 0) {
		throw ("Text to search must not be empty");
	}
	// http://m.endic.naver.com/search.nhn?msearch=celebrity&query=celebrity&searchOption=
	var req = request.Request({
		url: "http://m.endic.naver.com/search.nhn",
		content: {
			"searchOption": "",
			"msearch": text,
			"query": text,
		},
		onComplete: function(response) {
			callback(response.text);
		}
	});
	console.log("request..." + req.url);
	req.get();
}

// Export the 'search' function
exports.search = search;