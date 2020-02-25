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
 * Manages system moduels
 */
angular.module('mblowfish-core').service('$modules', function(
	/* MBlowfish */ $app,
	/* Angularjs */ $window, $q,
	/* am-wb     */ $dispatcher
) {

	var LOCAL_MODULE_KEY = 'app.settings.modules';
	var GLOBAL_MODULE_KEY = 'app.configs.modules';

	this.addGlobalModule = function() { };
	this.removeGlobalModule = function() { };
	this.getGlobalModules = function() {
		return this.globalModules;
	};


	this.addLocalModule = function(module) {
		this.loadModule(module);
		this.localModules.push(module);
		$app.setProperty(LOCAL_MODULE_KEY, this.localModules);
	};

	this.removeLocalModules = function() {
		this.localModules = [];
		$app.setProperty(LOCAL_MODULE_KEY, this.localModules);
	};

	this.removeLocalModule = function(module) {
		var targetModule;
		_.forEach(this.localModules, function(item) {
			if (module.url === item.url) {
				targetModule = item;
			}
		});

		if (_.isUndefined(targetModule)) {
			return;
		}

		var index = this.localModules.indexOf(targetModule);
		this.localModules.splice(index, 1);
		$app.setProperty(LOCAL_MODULE_KEY, this.localModules);
		// TODO: need to reload the page
	};

	this.getLocalModules = function() {
		return this.localModules;
	};

	this.loadModule = function(module) {
		var job;
		switch (module.type) {
			case 'js':
				job = $window.loadLibrary(module.url);
				break;
			case 'css':
				job = $window.loadStyle(module.url);
				break;
		}
		return job;
	};

	this.isLoaded = function() {
		return this._loaded;
	};

	this.load = function() {
		this._loaded = true;

		this.localModules = $app.getProperty(LOCAL_MODULE_KEY) || [];
		this.globalModules = $app.getProperty(GLOBAL_MODULE_KEY) || [];

		var jobs = [];
		var ctrl = this;
		_.forEach(this.localModules, function(module) {
			jobs.push(ctrl.loadModule(module));
		});
		_.forEach(this.globalModules, function(module) {
			jobs.push(ctrl.loadModule(module));
		});

		return $q.all(jobs);
	};

	// staso, 2019: fire the state is changed
	this.localModules = [];
	this.globalModules = [];
	var ctrl = this;
	$dispatcher.on('/app/state', function($event) {
		if ($event.value === 'ready' && !ctrl.isLoaded()) {
			ctrl.load();
		}
	});
});