// Import the APIs we need.

exports.main = function(options, callbacks) {
	//console.log(options.loadReason);

	function determineSearchUrlPrefix(searchType) {
		return (searchType == "pc" ? "endic.naver.com" : "m.endic.naver.com");
	}

	function makeDictWindowScript(searchUrlPrefix, windowWidth, windowHeight) {
		return 'var text = window.getSelection().toString(); var encodedText = encodeURIComponent(text); var url="http://' + searchUrlPrefix + '/search.nhn?msearch=" + encodedText + "&query=" + encodedText + "&searchOption="; window.open(url, "네이버 영어사전", "width=' + windowWidth + ', height=' + windowHeight + ', resizable=no, scrollbars=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, copyhitory=no");'; 
	}

	var pageMod = require("page-mod");
	function registerCtrlDblClickPageMod(searchType, windowWidth, windowHeight, comboKey) {
		var searchUrlPrefix = determineSearchUrlPrefix(searchType);
		var dictWindowScript = makeDictWindowScript(searchUrlPrefix, windowWidth, windowHeight);
		pageMod.PageMod({
			include: "*",
			contentScript: 
			'document.addEventListener("dblclick", dblClick, false); function dblClick(event) { var e = event ? event : window.event; var comboKey = "' + comboKey + '"; if ((comboKey == "Ctrl" && e.ctrlKey) || (comboKey == "Alt" && e.altKey) || (comboKey == "Shift" && e.shiftKey) || (comboKey == "Meta" && e.metaKey)) { ' + dictWindowScript + ' } return false; }'
		});
	}

	var contextMenu = require("context-menu");
	var menuItem = null;
	function createMenuItem(searchType, windowWidth, windowHeight) {
		var searchUrlPrefix = determineSearchUrlPrefix(searchType);
		var dictWindowScript = makeDictWindowScript(searchUrlPrefix, windowWidth, windowHeight);
		// Create a new context menu item
		menuItem = contextMenu.Item({
			label: "네이버 영어사전 검색",
			// Show this item when a selection exists.
			context: contextMenu.SelectionContext(),
			// When this item is clicked, post a message to the item with the
			// selected text and current URL.
			contentScript: 'self.on("click", function (node, data) {' + dictWindowScript + '});',
		});
	}
	
	// a panel for preferences 
	var data = require("self").data;
	var settingsPanel = require("panel").Panel({
		width: 350,
		height: 154,
		contentURL: data.url("settings.html"),
		contentScriptFile: data.url('settings.js'),
		contentScriptWhen: 'ready'
	});
	require("widget").Widget({
		id: "User Preferences of Naver English Dictionary Extension",
		label: "네이버 영어사전 사용자 설정",
		contentURL: data.url("settings.png"),
		panel: settingsPanel
	});
	
	// user settings
	var ss = require("simple-storage").storage;
	if (!ss.settings) {
		ss.settings = {};
	}
	// from this script to settings.html
	//settingsPanel.port.emit("updateSettings", ss.settings);
	settingsPanel.port.on("getSettings", function(msg) {
		/*
		console.log("received getSettings");
		for (var n in ss.settings) {
			console.log(n + "=" + ss.settings[n]);
		}
		*/
		settingsPanel.port.emit("updateSettings", ss.settings);
	});
	// from settings.html to this script
	settingsPanel.port.on("change", function(msg) {
		ss.settings[msg.name] = msg.value;
		//console.log("changed: " + ss.settings["searchType"] + ", " + ss.settings["comboKey"] + ", " + ss.settings["windowWidth"] + ", " + ss.settings["windowHeight"]);
		menuItem.destroy();
		console.log("menuItem is destoryed");
		createMenuItem(ss.settings["searchType"], ss.settings["windowWidth"], ss.settings["windowHeight"]);
	});
	
	registerCtrlDblClickPageMod(ss.settings["searchType"], ss.settings["windowWidth"], ss.settings["windowHeight"], ss.settings["comboKey"]);
	createMenuItem(ss.settings["searchType"], ss.settings["windowWidth"], ss.settings["windowHeight"]);
};
