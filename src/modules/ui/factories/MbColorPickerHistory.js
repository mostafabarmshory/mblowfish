
export default function($injector, MbColor) {

	var history = [];
	var strHistory = [];

	var $cookies = false;
	try {
		$cookies = $injector.get('$cookies');
	} catch (e) {
		// Handler error
	}

	if ($cookies) {
		var tmpHistory = $cookies.getObject('mbColorPickerHistory') || [];
		for (var i = 0; i < tmpHistory.length; i++) {
			history.push(new MbColor(tmpHistory[i]));
			strHistory.push(tmpHistory[i]);
		}
	}

	var length = 40;

	return {
		length: function() {
			if (arguments[0]) {
				length = arguments[0];
			} else {
				return history.length;
			}
		},
		add: function(color) {
			for (var x = 0; x < history.length; x++) {
				if (history[x].toRgbString() === color.toRgbString()) {
					history.splice(x, 1);
					strHistory.splice(x, 1);
				}
			}

			history.unshift(color);
			strHistory.unshift(color.toRgbString());

			if (history.length > length) {
				history.pop();
				strHistory.pop();
			}
			if ($cookies) {
				$cookies.putObject('mbColorPickerHistory', strHistory);
			}
		},
		get: function() {
			return history;
		},
		reset: function() {
			history = [];
			strHistory = [];
			if ($cookies) {
				$cookies.putObject('mbColorPickerHistory', strHistory);
			}
		}
	};
}

