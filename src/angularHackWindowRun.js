
/*

@ngInject 
*/
function angularHackWindowRun($window, $q, $rootScope, $mbNotification) {

	var libs = {};
	var styles = {};

	/**
	 * Loads a library
	 * 
	 * @memberof NativeWindowWrapper
	 * @path path of library
	 * @return promise to load the library
	 */
	$window.loadLibrary = function(path) {
		if (libs[path]) {
			return $q.resolve({
				message: 'isload'
			});
		}
		var defer = $q.defer();

		//		var document = this.getDocument();
		var script = document.createElement('script');
		script.src = path;
		script.async = 1;
		script.onload = function() {
			libs[path] = true;
			defer.resolve({
				path: path,
				message: 'loaded'
			});
			if (!$rootScope.$$phase) {
				$rootScope.$digest();
			}
		};
		script.onerror = function() {
			libs[path] = false;
			defer.reject({
				path: path,
				message: 'fail'
			});
			if (!$rootScope.$$phase) {
				$rootScope.$digest();
			}
		};
		document.getElementsByTagName('head')[0].appendChild(script);
		return defer.promise;
	};

	$window.removeLibrary = function(path) {
		return $q.resolve({
			source: path
		});
	};

	/**
	 * Check if the library is loaded
	 * 
	 * @memberof NativeWindowWrapper
	 * @return true if the library is loaded
	 */
	$window.isLibraryLoaded = function(path) {
		if (libs[path]) {
			return true;
		}
		return false;
	};

	/**
	 * Loads a style
	 * 
	 * loads css 
	 * 
	 * @memberof NativeWindowWrapper
	 * @path path of library
	 * @return promise to load the library
	 */
	$window.loadStyle = function(path) {
		if (styles[path]) {
			return $q.resolve(styles[path]);
		}
		var defer = $q.defer();

		//		var document = this.getDocument();
		var style = document.createElement('link');
		style.setAttribute('rel', 'stylesheet');
		style.setAttribute('type', 'text/css');
		style.setAttribute('href', path);
		style.onload = function() {
			styles[path] = {
				element: style,
				path: path
			};
			defer.resolve(styles[path]);
			if (!$rootScope.$$phase) {
				$rootScope.$digest();
			}
		};
		style.onerror = function() {
			styles[path] = undefined;
			defer.reject({
				path: path,
				message: 'fail'
			});
			if (!$rootScope.$$phase) {
				$rootScope.$digest();
			}
		};
		document.getElementsByTagName('head')[0].appendChild(style);
		styles[path] = defer.promise;
		return styles[path];
	};

	$window.removeStyle = function(path) {
		if (!this.isStyleLoaded(path)) {
			return $q.resolve({});
		}
		var item = styles[path];
		item.element.parentNode.removeChild(item.element);
		styles[path] = undefined;
		$q.resolve(item);
	};

	/**
	 * Check if the style is loaded
	 * 
	 * @memberof NativeWindowWrapper
	 * @return true if the library is loaded
	 */
	$window.isStyleLoaded = function(path) {
		if (styles[path]) {
			return true;
		}
		return false;
	};


	/**
	 * Set meta
	 * 
	 * @memberof NativeWindowWrapper
	 * @params key {string} the key of meta
	 * @params value {string} the value of meta
	 */
	$window.setMeta = function(key, value) {
		var searchkey = key.replace(new RegExp(':', 'g'), '\\:');
		var headElement = $('head');
		var elements = headElement.find('meta[name="' + searchkey + '"]');
		// remove element
		if (_.isUndefined(value)) {
			if (elements.length) {
				elements.remove();
			}
			return;
		}
		// update element
		var metaElement;
		if (elements.length === 0) {
			// title element not found
			metaElement = angular.element('<meta name=\'' + key + '\' content=\'\' />');
			headElement.append(metaElement);
		} else {
			metaElement = angular.element(elements[0]);
		}
		metaElement.attr('content', value);
	};

	$window.getMeta = function(key) {
		var searchkey = key.replace(new RegExp(':', 'g'), '\\:');
		var headElement = $('head');
		var elements = headElement.find('meta[name="' + searchkey + '"]');
		if (elements.length === 0) {
			return;
		}
		return elements.attr('content');
	};

	/**
	 * Set link
	 * 
	 * @memberof NativeWindowWrapper
	 * @params key {string} the key of meta
	 * @params data {string} the value of meta
	 */
	$window.setLink = function(key, data) {
		var searchkey = key.replace(new RegExp(':', 'g'), '\\:');
		var headElement = $('head');
		var elements = headElement.find('link[key=' + searchkey + ']');
		var metaElement;
		if (elements.length === 0) {
			// title element not found
			metaElement = angular.element('<link key=\'' + key + '\' />');
			headElement.append(metaElement);
		} else {
			metaElement = angular.element(elements[0]);
		}
		for (var property in data) {
			metaElement.attr(property, data[property]);
		}
	};


	// Hadi 1396-12-22: update alerts
	window.alert = $mbNotification.alert;
	window.confirm = $mbNotification.confirm;
	window.prompt = $mbNotification.prompt;
	window.toast = $mbNotification.toast;
}

export default angularHackWindowRun;
