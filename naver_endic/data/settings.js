var inputs = document.querySelectorAll("input");
for (var i = 0; i < inputs.length; i++) {
	inputs.item(i).addEventListener('change', function() {
		self.port.emit("change", { "name": this.name, "value": this.value });
	}, false)
}

self.port.emit('getSettings');
self.port.on('updateSettings', function onMessage(settings) {
	for (var name in settings) {
		var elements = document.getElementsByName(name);
		if (elements.length > 1) {
			for (var i = 0; i < elements.length; i++) {
				if (elements[i].value == settings[name]) {
					elements[i].checked = true;
					break;
				}
			}
		} else {
			elements[0].value = settings[name];
		}
	}
});
