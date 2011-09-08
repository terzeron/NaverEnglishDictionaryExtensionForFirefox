// Import the APIs we need.
var contextMenu = require("context-menu");
var selection = require("selection");
var naver_endic = require("naver_endic");

exports.main = function(options, callbacks) {
	console.log(options.loadReason);

	// Create a new context menu item.
	var menuItem = contextMenu.Item({
		label: "네이버 영어사전 검색",
		// Show this item when a selection exists.
		context: contextMenu.SelectionContext(),
		// When this item is clicked, post a message to the item with the
		// selected text and current URL.
		contentScript: 'self.on("click", function (node, data) {' +
            '  var text = window.getSelection().toString();' +
            '  var url="http://m.endic.naver.com/search.nhn?msearch=" + encodeURI(text) + "&query=" + encodeURI(text) + "&searchOption=";' +
			'  var divElement = document.createElement("div");' +
			'  divElement.setAttribute("style", "z-index: 999; left: 50px; top: 50px; position: fixed; border: 1px solid black; display: block;");' +
			'  divElement.setAttribute("onmouseout", "this.parentNode.removeChild(this); /*this.style.visibility=\'hidden\';*/");' +
			'  divElement.innerHTML = "<iframe width=\'340\' height=\'480\' allowTransparency=\'true\' style=\'border: 0px; filter:Alpha(Opacity=10);\' scrolling=\'auto\' src=\'" + url + "\'></iframe>";' +
			'  document.body.appendChild(divElement);' + 
            '});',
	});
};

exports.onUnload = function (reason) {
	console.log(reason);
};
