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


angular.module('mblowfish-core')
	/**
	 * 
	 */
	.config(function($routeProvider, $locationProvider) {
		$routeProvider//

			/**
			 * @ngdoc ngRoute
			 * @name /preferences/languages/manager
			 * @description Load language manager
			 * 
			 * Manages languages and allow user to add a new one.
			 */
			.when('/preferences/languages/manager', {
				templateUrl: 'views/mb-languages.html',
				/*
				 * Check if user is owner
				 * @ngInject
				 */
				protect: function($rootScope) {
					var permissions = $rootScope.__account.permissions;
					return !(permissions.tenant_owner || permissions.core_owner || permissions.Pluf_owner);
				}
			})

			/**
			 * @ngdoc ngRoute
			 * @name /preferences
			 * @description preferences pages
			 */
			.when('/preferences', {
				templateUrl: 'views/mb-preferences.html',
				controller: 'MbPreferencesCtrl',
				controllerAs: 'ctrl',
				helpId: 'preferences',
				/*
				 * @ngInject
				 */
				protect: function($rootScope) {
					return !$rootScope.__account.permissions.tenant_owner;
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
				templateUrl: 'views/mb-preference.html',
				controller: 'MbPreferenceCtrl',
				/*
				 * @ngInject
				 */
				helpId: function($routeParams) {
					return 'preferences-' + $routeParams.preferenceId;
				},
				/*
				 * @ngInject
				 */
				protect: function($rootScope) {
					return !$rootScope.__account.permissions.tenant_owner;
				}
			})

			// Users
			// Login
			.when('/users/login', {
				templateUrl: 'views/users/mb-login.html',
				controller: 'MbAccountCtrl',
				controllerAs: 'ctrl',
				sidenavs: [],
				toolbars: []
			})

			//-----------------------------------------------------------------------------
			// Move to account (vw-dashboard)
			//-----------------------------------------------------------------------------
			/**
			 * @ngdoc ngRoute
			 * @name /users/account
			 * @description Details of the current account
			 */
			.when('/users/account', {
				templateUrl: 'views/users/mb-account.html',
				controller: 'MbAccountCtrl',
				controllerAs: 'ctrl',
				protect: true,
				helpId: 'mb-account'
			})
			/**
			 * @ngdoc ngRoute
			 * @name /users/profile
			 * @description Profile of the current account
			 */
			.when('/users/profile', {
				templateUrl: 'views/users/mb-profile.html',
				controller: 'MbProfileCtrl',
				controllerAs: 'ctrl',
				protect: true,
				helpId: 'mb-profile'
			})
			/**
			 * @ngdoc ngRoute
			 * @name /users/password
			 * @description Manage current password of the account
			 * 
			 * Change the password of the current account.
			 */
			.when('/users/password', {
				templateUrl: 'views/users/mb-password.html',
				controller: 'MbAccountCtrl',
				controllerAs: 'ctrl',
				protect: true,
				helpId: 'mb-profile'
			})

			// Reset forgotten password
			.when('/users/reset-password', {
				templateUrl: 'views/users/mb-forgot-password.html',
				controller: 'MbAccountCtrl',
				controllerAs: 'ctrl',
				sidenavs: [],
				toolbars: []
			})//
			.when('/users/reset-password/token', {
				templateUrl: 'views/users/mb-recover-password.html',
				controller: 'MbAccountCtrl',
				controllerAs: 'ctrl',
				sidenavs: [],
				toolbars: []
			})//
			.when('/users/reset-password/token/:token', {
				templateUrl: 'views/users/mb-recover-password.html',
				controller: 'MbAccountCtrl',
				controllerAs: 'ctrl',
				sidenavs: [],
				toolbars: []
			})//



			.when('/mb/ui/views/navigator/', {
				title: 'Navigator',
				description: 'Navigate all path and routs of the pandel',
				controller: 'AmdNavigatorCtrl',
				controllerAs: 'ctrl',
				templateUrl: 'views/mb-navigator.html',
			})
			;//

		$locationProvider.html5Mode(true);
	});
