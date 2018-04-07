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

angular.module('mblowfish-core')
/**
 * 
 */
.config(function($routeProvider, $locationProvider) {
	$routeProvider//
	/**
	 * @ngdoc ngRoute
	 * @name /initialization
	 * @description Initial page
	 */
	.when('/initialization', {
		templateUrl : 'views/mb-initial.html',
		controller : 'MbInitialCtrl'
	})
	/**
	 * @ngdoc ngRoute
	 * @name /preferences
	 * @description preferences pages
	 */
	.when('/preferences', {
		templateUrl : 'views/mb-preferences.html',
		controller : 'MbPreferencesCtrl',
		helpId: 'preferences',
	}) //
	/**
	 * @ngdoc ngRoute
	 * @name /preferences/:page
	 * @description Preferences page
	 * 
	 * Display a preferences page to manage a part of settings. Here is list of
	 * default pages:
	 * 
	 * - google-analytic
	 * - brand
	 * - update
	 * - pageNotFound
	 */
	.when('/preferences/:preferenceId', {
		templateUrl : 'views/mb-preference.html',
		controller : 'MbPreferenceCtrl',
		helpId: function(currentState){
			return 'preference-' + currentState.params['preferenceId'];
		}
	}); //

	$locationProvider.html5Mode(true);
});
