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
'use strict';

describe('Module service ', function() {
	var $window;
	var $modules;
	var $app;
	var $dispatcher;

	// load the controller's module
	beforeEach(module('mblowfish-core'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function(_$window_, _$modules_, _$app_, _$dispatcher_) {
		$window = _$window_;
		$modules = _$modules_;
		$app = _$app_;
		$dispatcher = _$dispatcher_;
	}));

	it('should add api to enable extensions ', function() {
		expect(angular.isFunction($window.mblowfish.addExtension)).toBe(true);
		expect(angular.isFunction(mblowfish.addExtension)).toBe(true);
	});

	it('should load and add extionstion ', function() {
		function ext1(){}
		mblowfish.addExtension(ext1);
		expect(mblowfish.extensions.length).toBe(1);
	});

	it('should inject all services', function() {
		function ext1($modules) {
			expect($modules).not.toBe(undefined);
		};

		mblowfish.addExtension(ext1);
		expect(mblowfish.extensions.length).toBe(1);
	});

	it('should load a css module', function() {
		var module = {
			url: 'path/to/undifined',
			type: 'css'
		};
		$modules.loadModule(module);
		expect($window.isStyleLoaded(module.url)).toBe(true);
	});

	it('should load a js module', function() {
		var module = {
			url: 'path/to/undifined',
			type: 'js'
		};
		$modules.loadModule(module);
		expect($window.isLibraryLoaded(module.url)).toBe(false);
	});

	it('should clean all modules from settings', function() {
		var module = {
			url: 'path/to/undifined',
			type: 'js'
		};
		$modules.addLocalModule(module);
		var lmodules = $modules.getLocalModules();
		expect(lmodules.length > 0).toBe(true);
		lmodules = $app.getProperty('app.settings.modules');
		expect(lmodules.length > 0).toBe(true);

		$modules.removeLocalModules();
		var lmodules = $modules.getLocalModules();
		expect(lmodules.length === 0).toBe(true);
		lmodules = $app.getProperty('app.settings.modules');
		expect(lmodules.length === 0).toBe(true);
	});

	it('should remove a module from settings', function() {
		var module = {
			url: 'path/to/undifined/' + Math.random(),
			type: 'js'
		};

		$modules.removeLocalModules();
		$modules.addLocalModule(module);
		var lmodules = $modules.getLocalModules();
		expect(lmodules.length === 1).toBe(true);
		lmodules = $app.getProperty('app.settings.modules');
		expect(lmodules.length === 1).toBe(true);
	});

	it('should remove a module from application', function() {
		var module = {
			url: 'path/to/undifined/' + Math.random(),
			type: 'js'
		};

		var module2 = {
			url: 'path/to/undifined/' + Math.random(),
			type: 'js'
		};

		$modules.removeLocalModules();
		$modules.addLocalModule(module);
		$modules.removeLocalModule(module2);
		var lmodules = $modules.getLocalModules();
		expect(lmodules.length === 1).toBe(true);
		lmodules = $app.getProperty('app.settings.modules');
		expect(lmodules.length === 1).toBe(true);

		$modules.removeLocalModule(module);
		var lmodules = $modules.getLocalModules();
		expect(lmodules.length === 0).toBe(true);
		lmodules = $app.getProperty('app.settings.modules');
		expect(lmodules.length === 0).toBe(true);
	});



	it('should load modules from application settings', function() {
		var module1 = {
			url: 'path/to/undifined/' + Math.random(),
			type: 'js'
		};

		var module2 = {
			url: 'path/to/undifined/' + Math.random(),
			type: 'js'
		};

		$modules.removeLocalModules();
		lmodules = $app.setProperty('app.settings.modules', [module1]);
		lmodules = $app.setProperty('app.configs.modules', [module2]);


		$dispatcher.dispatch('/app/state', {
			type: 'update',
			value: 'ready',
		});
		var lmodules = $modules.getLocalModules();
		expect(lmodules.length === 1).toBe(true);
	});
});
