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
	
	// Preferences
	/**
	 * @ngdoc ngRoute
	 * @name /initialization
	 * @description Initial page
	 */
	.when('/initialization', {
		templateUrl : 'views/mb-initial.html',
		controller : 'MbInitialCtrl',
		/*
		 * @ngInject
		 */
		protect : function($rootScope) {
			return !$rootScope.app.user.owner;
		},
		sidenavs: [],
		toolbars: []
	})
	/**
	 * @ngdoc ngRoute
	 * @name /preferences
	 * @description preferences pages
	 */
	.when('/preferences', {
		templateUrl : 'views/mb-preferences.html',
		controller : 'MbPreferencesCtrl',
		helpId : 'preferences',
		/*
		 * @ngInject
		 */
		protect : function($rootScope) {
			return !$rootScope.app.user.owner;
		}
	}) //
	/**
	 * @ngdoc ngRoute
	 * @name /preferences/:page
	 * @description Preferences page
	 * 
	 * Display a preferences page to manage a part of settings. Here is list of
	 * default pages: - google-analytic - brand - update - pageNotFound
	 */
	.when('/preferences/:preferenceId', {
		templateUrl : 'views/mb-preference.html',
		controller : 'MbPreferenceCtrl',
		helpId : function(currentState) {
			return 'preference-' + currentState.params['preferenceId'];
		},
		/*
		 * @ngInject
		 */
		protect : function($rootScope) {
			return !$rootScope.app.user.owner;
		}
	})
	
	// Users
	// Login
	.when('/users/login', {
		templateUrl : 'views/users/mb-login.html',
		controller : 'MbAccountCtrl',
		sidenavs: [],
		toolbars: []
	})
	/**
	 * @ngdoc ngRoute
	 * @name /users/account
	 * @description Details of the current account
	 */
	.when('/users/account', {
		templateUrl : 'views/users/mb-account.html',
		controller : 'MbAccountCtrl',
		protect: true
	})
	/**
	 * @ngdoc ngRoute
	 * @name /users/profile
	 * @description Profile of the current account
	 */
	.when('/users/profile', {
		templateUrl : 'views/users/mb-profile.html',
		controller : 'MbProfileCtrl',
		protect: true
	})
	
	// Reset forgotten password
	.when('/users/reset-password', {
		templateUrl : 'views/users/mb-forgot-password.html',
		controller : 'MbPasswordCtrl',
		sidenavs: [],
		toolbars: []
	})//
	.when('/users/reset-password/token', {
		templateUrl : 'views/users/mb-recover-password.html',
		controller : 'MbPasswordCtrl',
		sidenavs: [],
		toolbars: []
	})//
	.when('/users/reset-password/token/:token', {
		templateUrl : 'views/users/mb-recover-password.html',
		controller : 'MbPasswordCtrl',
		sidenavs: [],
		toolbars: []
	})//
	; //

	$locationProvider.html5Mode(true);
});
