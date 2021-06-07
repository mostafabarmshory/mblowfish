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


//------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------
var mbDispatcher,
	mbStorage,
	mbApplication,
	q;

var provider;
var service;

//------------------------------------------------------------------------------
// variables
//------------------------------------------------------------------------------

var modules = {};


//------------------------------------------------------------------------------
// Functions
//------------------------------------------------------------------------------
function moduleLoadLibrary(path) {
	var defer = jQuery.Deferred();
	var script = document.createElement('script');
	script.src = path;
	script.async = 1;
	script.onload = function() {
		defer.resolve();
	};
	script.onerror = function() {
		defer.reject({
			path: path,
			message: 'fail'
		});
	};
	document.getElementsByTagName('head')[0].appendChild(script);
	return defer;
}

/**
 * Loads a style
 * 
 * loads css 
 * 
 * @memberof NativeWindowWrapper
 * @path path of library
 * @return promise to load the library
 */
function moduleLoadStyle(path) {
	var defer = jQuery.Deferred();
	var style = document.createElement('link');
	style.setAttribute('rel', 'stylesheet');
	style.setAttribute('type', 'text/css');
	style.setAttribute('href', path);
	style.onload = function() {
		defer.resolve(path);
	};
	style.onerror = function() {
		defer.reject({
			path: path,
			message: 'fail'
		});
	};
	document.getElementsByTagName('head')[0].appendChild(style);
	return defer;
}

export function moduleLoad(module) {
	var deferred;
	switch (module.type) {
		case 'js':
			deferred = moduleLoadLibrary(module.url);
			break;
		case 'css':
			deferred = moduleLoadStyle(module.url);
			break;
	}
	return deferred;
}


function addModule(module) {
	modules[module.url] = module;
	saveModules();
	//>> fire changes
	mbDispatcher.dispatch(MB_MODULE_SP, {
		type: 'create',
		items: [module]
	});
}

function removeModule(module) {
	delete modules[module.url];
	saveModules();
	//>> fire changes
	mbDispatcher.dispatch(MB_MODULE_SP, {
		type: 'delete',
		items: [module]
	});
}

function getModules() {
	return modules;
}

function saveModules() {
	//>> Save changes
	mbStorage[MB_MODULE_SK] = _.cloneDeep(modules);
}

function load() {
	modules = mbStorage.mbModules || {};
}

function $get(
	/* Angularjs */ $q,
	/* am-wb     */ $mbApplication, $mbDispatcher, $mbStorage) {
	"ngInject";
	q = $q;
	mbApplication = $mbApplication;
	mbDispatcher = $mbDispatcher;
	mbStorage = $mbStorage;

	load();

	return service;
}

service = {
	removeModule: removeModule,
	addModule: addModule,
	getModules: getModules,
};

provider = {
	$get: $get,
	enable: function(enable) {
		moduleEnable = enable;
	}
};

/**
 * Manages system moduels
 */
export default function() {
	return provider;
};


