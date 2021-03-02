/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
@ngdoc service
@name $mbSettings
@description Default selection system.
 */
function mbSettings() {
	//---------------------------------------
	// Services
	//---------------------------------------
	var provider;
	var service;
	
	var rootScope,
		q,
		mbStorage,
		mbDispatcherUtil;

	//---------------------------------------
	// Variables
	//---------------------------------------
	var templateUrl = 'resources/settings-template.json';
	var exrpressionsEnabled = false;
	var settings = {};
	var autosave = true;
	//---------------------------------------
	// functions
	//---------------------------------------
	/**
	Loads settings and get ready
	
	@memberof $mbSettings
	@returns {Promise} A promise to load settings
	 */
	function load() {
		settings = mbStorage[MB_SETTINGS_SP] || {};
		rootScope.settings = settings;
	}

	function get(key, defaultValue) {
		return settings[key] || defaultValue;
	}

	function set(key, value) {
		settings[key] = value;
		if (autosave) {
			save();
		}
		// Fire setting is changed
		mbDispatcherUtil.fireUpdated(MB_SETTINGS_ST, {
			values: [value],
			keys: [key]
		});
		return service;
	}

	function save() {
		mbStorage[MB_SETTINGS_SP] = settings;
	}

	function has(key) {
		return ~_.isUndefined(settigns[key]);
	}

	function setTemplateUrl(url) {
		templateUrl = url;
		return provider;
	}

	function loadLocalData() {
		/*
		 * TODO: masood, 2018: The lines below is an alternative for lines above
		 * but not recommended.
		 * 
		 * TODO: 'key' of app should be used $mbStorage,.setPrefix(key);
		 */
		var settings = mbStorage.$default({
			dashboardModel: {}
		});
		return q.resolve(settings)
			.then(parsAppSettings);
	}

	function setAutosaveEnabled(flag) {
		autosave = flag;
		return provider;
	}

	function setExrpressionsEnabled() {

	}

	//---------------------------------------
	// End
	//---------------------------------------
	service = {
		load: load,
		get: get,
		set: set,
		save: save,
		has: has,
	};

	provider = {
		/* @ngInject */
		$get: function($rootScope, $mbStorage, $q, $mbDispatcherUtil) {
			rootScope = $rootScope;
			mbStorage = $mbStorage;
			q = $q;
			mbDispatcherUtil = $mbDispatcherUtil;
			
			load();

			return service;
		},
		setTemplateUrl: setTemplateUrl,
		setAutosaveEnabled: setAutosaveEnabled,
		setExrpressionsEnabled: setExrpressionsEnabled,
	};
	return provider;
}

export default mbSettings;





