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
 * دریچه‌های محاوره‌ای
 */
angular.module('mblowfish-core').run(function($sidenav, $toolbar, $rootScope, $navigator, $route, $actions, $help) {
	/***************************************************************************
	 * New app state
	 * 
	 * Application state is saved in the root scope
	 **************************************************************************/
	/*
	 * Store application state
	 */
	$rootScope.__app = {
		/******************************************************************
		 * New model
		 ******************************************************************/
		state: 'waiting',
		key: '',
		configs: {},
		settings: {},
		language: 'en',
		/******************************************************************
		 * Old model
		 ******************************************************************/
		logs: [],
		user: {
			current: {},
			profile: {},
			anonymous: true,
			administrator: false,
			owner: false,
			member: false,
			authorized: false
		},
		// application settings
		config: {},
		// user settings
		setting: {},
		/*
		 * NOTE: this part is deprecated use tenant
		 */
		// tenant settings
		options: {},
		local: 'en', // Default local and language
		dir: 'rtl'
	};
	$rootScope.app = $rootScope.__app;

	/*
	 * Store tenant sate
	 */
	$rootScope.__tenant = {
		id: 0,
		title: 'notitle',
		description: 'nodescription',
		configs: {},
		settings: {},
		domains: {}
	};

	/*
	 * Store account state
	 */
	$rootScope.__account = {
		anonymous: true,
		id: 0,
		login: '',
		profile: {},
		roles: {},
		groups: {},
		permissions: {},
		messages: []
	}


	/***************************************************************************
	 * Application actions
	 **************************************************************************/
	$actions.newAction({
		id: 'mb.preferences',
		priority: 15,
		icon: 'settings',
		title: 'Preferences',
		description: 'Open preferences panel',
		visible: function() {
			return $rootScope.__account.permissions.tenant_owner;
		},
		action: function() {
			return $navigator.openPage('preferences');
		},
		groups: ['mb.toolbar.menu']
	});
	$actions.newAction({// help
		id: 'mb.help',
		priority: 15,
		icon: 'help',
		title: 'Help',
		description: 'Display help in sidenav',
		visible: function() {
			return $help.hasHelp($route.current);
		},
		action: function() {
			$help.openHelp($route.current);
		},
		groups: ['mb.toolbar.menu']
	});
	$actions.newAction({
		icon: 'account_circle',
		title: 'Profile',
		description: 'User profile',
		groups: ['mb.user'],
		action: function() {
			return $navigator.openPage('users/profile');
		}
	});
	$actions.newAction({
		icon: 'account_box',
		title: 'Account',
		description: 'User account',
		groups: ['mb.user'],
		action: function() {
			return $navigator.openPage('users/account');
		}
	});
	$actions.newAction({
		icon: 'fingerprint',
		title: 'Password',
		description: 'Manage password',
		groups: ['mb.user'],
		action: function() {
			return $navigator.openPage('users/password');
		}
	});

	$toolbar.newToolbar({
		id: 'dashboard',
		title: 'Dashboard toolbar',
		description: 'Main dashboard toolbar',
		controller: 'MbToolbarDashboardCtrl',
		templateUrl: 'views/toolbars/mb-dashboard.html'
	});

	$sidenav.newSidenav({
		id: 'navigator',
		title: 'Navigator',
		description: 'Navigate all path and routs of the pandel',
		controller: 'AmdNavigatorCtrl',
		templateUrl: 'views/mb-navigator.html',
		locked: true,
		position: 'start'
	});
	$sidenav.newSidenav({
		id: 'help',
		title: 'Help',
		description: 'System online help',
		controller: 'MbHelpCtrl',
		templateUrl: 'views/sidenavs/mb-help.html',
		locked: true,
		visible: function() {
			return $rootScope.showHelp;
		},
		position: 'end'
	});
	$sidenav.newSidenav({
		id: 'settings',
		title: 'Options',
		description: 'User options',
		controller: 'MbOptionsCtrl',
		templateUrl: 'views/sidenavs/mb-options.html',
		locked: false,
		position: 'end'
	});
	$sidenav.newSidenav({
		id: 'messages',
		title: 'Messages',
		description: 'User message queue',
		controller: 'MessagesCtrl',
		controllerAs: 'ctrl',
		templateUrl: 'views/sidenavs/mb-messages.html',
		locked: false,
		position: 'start'
	});
});