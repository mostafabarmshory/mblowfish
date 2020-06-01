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
import angular from 'angular';
import MBlowfish from './mblowfish.js';

let requiredModues = [ //
	//	Angular
	'ngMaterial',
	'ngAnimate',
	'ngCookies',
	'ngSanitize', //
	//	Seen
	'seen-core',
	'seen-user',
	'seen-tenant',
	'seen-cms',
	'seen-monitor',
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
];


/*
Load application configuration

@ngInject
 */
function configureApplication($mdThemingProvider) {
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
}

/*
Runs basic task to init the application

@ngInject
 */
function initApplication($widget, $mbRouteParams, $injector, $window, $mbEditor) {
	$widget.setProvider('$mbRouteParams', $mbRouteParams);

	$mbEditor.registerEditor('/ui/notfound/:path*', {
		templateUrl: './views/mb-preloading-default.html',
		controller: 'MbNotfoundEditorCtrl'
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
}

var angularModule = angular.module('mblowfish-core', requiredModues)
	.config(configureApplication)
	.run(initApplication)
	
	;
/***************************************************************************
 * Mblowfish global service
 ***************************************************************************/
window.mblowfish = new MBlowfish({
	module: angularModule
});


