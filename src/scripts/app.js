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
@ngdoc action-group
@name User
@description Global user menu

There are several registred menu in the $actions service. Modules can contribute
to the dashbord by addin action into it.

- mb.user : All action related to the current user
- mb.toolbar.menu : All action related to the toolbar menu
- navigationPathMenu: All items related to navigation.

 */
var mbApplicationModule = angular
	.module('mblowfish-core', [ //
		//	Angular
		'ngMaterial',
		'ngAnimate',
		'ngCookies',
		'ngSanitize', //
		//	Seen
		'seen-core',
		'seen-user',
		'seen-tenant',
		'seen-supertenant',
		'seen-cms',
		'seen-monitor',
		'seen-shop',
		'seen-sdp',
		'seen-seo',
		//	AM-WB
		'am-wb-core',
		//	Others
		'lfNgMdFileInput', // https://github.com/shuyu/angular-material-fileinput
		'vcRecaptcha', //https://github.com/VividCortex/angular-recaptcha
		'ng-appcache',//
		'ngFileSaver',//
		'mdSteppers',//
		'angular-material-persian-datepicker',
		'pascalprecht.translate',
		'mdColorPicker',
	])
	.config(function($mdThemingProvider) {
		// Dark theme
		$mdThemingProvider
			.theme('dark')//
			.primaryPalette('grey', {
				'default': '900',
				'hue-1': '700',
				'hue-2': '600',
				'hue-3': '500'
			})//
			.accentPalette('grey', {
				'default': '700'
			})//
			.warnPalette('red')
			.backgroundPalette('grey')
			.dark();

		$mdThemingProvider.alwaysWatchTheme(true);
	})
	.run(function instantiateRoute($widget, $mbRouteParams, $injector, $window, $mbEditor) {
		$widget.setProvider('$mbRouteParams', $mbRouteParams);

		$mbEditor.registerEditor('/ui/notfound/:path*', {
			template: '<h1>Not found</h1>'
		});

		var extensions = $window.mblowfish.extensions;
		$window.mblowfish.extensions = [];

		/**
		 * Enable an extionsion
		 */
		$window.mblowfish.addExtension = function(loader) {
			$window.mblowfish.extensions.push(loader);
			$injector.invoke(loader);
		};

		angular.forEach(extensions, function(ext) {
			$window.mblowfish.addExtension(ext);
		});
	});

/***************************************************************************
 * Mblowfish global service
 ***************************************************************************/
window.mblowfish = {
	extensions: [],
	addExtension: function(loader) {
		this.extensions.push(loader);
		return window.mblowfish;
	},



	//-------------------------------------------------------------
	// Module
	//-------------------------------------------------------------
	controller: function() {
		mbApplicationModule.controller.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	service: function() {
		mbApplicationModule.service.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	directive: function() {
		mbApplicationModule.directive.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	filter: function() {
		mbApplicationModule.filter.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	run: function() {
		mbApplicationModule.run.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	config: function() {
		mbApplicationModule.config.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	provider: function() {
		mbApplicationModule.provider.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	factory: function() {
		mbApplicationModule.factory.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},


	//-------------------------------------------------------------
	// Angular Map
	//-------------------------------------------------------------
	element: function() {
		angular.element.apply(mbApplicationModule, arguments);
		return window.mblowfish;
	},
	bootstrap: function(dom) {
		angular.bootstrap(dom, ['mblowfish-core'], {});
		return window.mblowfish;
	},
	loadModules: function(prefixKey) {
		var storage = storageSupported(window, 'localStorage');
		var moduleList = JSON.parse(storage.getItem(prefixKey + '.' + MODULE_STORAGE_KEY));
		var jobs = [];
		_.forEach(moduleList, function(module) {
			jobs.push(moduleLoad(module));
		});
		return jQuery.when.apply(jQuery, jobs);
	}
};

