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
 * دریچه‌های محاوره‌ای
 */
.run(function($app, $rootScope, $navigator, $route, $mdSidenav, $actions) {
	$actions.newAction({
		id: 'mb.preferences',
		priority : 15,
		icon : 'settings',
		title : 'Preferences',
		description : 'Open preferences panel',
		visible : function(){
			return $rootScope.app.user.owner;
		},
		action : function(){
			return $navigator.openPage('/preferences');
		},
		groups:['mb.toolbar.menu']
	});
	$actions.newAction({ // help
		id: 'mb.help',
		priority : 15,
		icon : 'help',
		title : 'Help',
		description : 'Display help in sidenav',
		visible : function(){
			return !!$route.current.helpId;
		},
		action : function(){
			$rootScope.showHelp = !$rootScope.showHelp;
		},
		groups:['mb.toolbar.menu']
	});
	
	$app.newToolbar({
		id : 'dashboard',
		title : 'Dashboard toolbar',
		description : 'Main dashboard toolbar',
		controller: 'MbToolbarDashboardCtrl',
		templateUrl : 'views/toolbars/mb-dashboard.html',
	});
	
	$app.newSidenav({
		id : 'navigator',
		title : 'Navigator',
		description : 'Navigate all path and routs of the pandel',
		controller: 'AmdNavigatorCtrl',
		templateUrl : 'views/sidenavs/mb-navigator.html',
		locked : true,
		position : 'start',
	});
	$app.newSidenav({
		id : 'help',
		title : 'Help',
		description : 'System online help',
		controller : 'MbHelpCtrl',
		templateUrl : 'views/sidenavs/mb-help.html',
		locked : true,
		visible : function() {
			return $rootScope.showHelp;
		},
		position : 'end'
	});
	$app.newSidenav({
		id : 'settings',
		title : 'Options',
		description : 'User options',
		controller : 'MbOptionsCtrl',
		templateUrl : 'views/sidenavs/mb-options.html',
		locked : false,
		position : 'end'
	});
});