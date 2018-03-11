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
.run(function($app, $rootScope, $navigator, $route, $mdSidenav) {
	$app.getToolbarMenu()//
	.item({
		priority : 15,
		icon : 'settings',
		label : 'Setting',
		tooltip : 'Open setting panel',
		visible : function(){
			return $rootScope.app.user.owner;
		},
		active : function(){
			return $navigator.openPage('/configs');
		}
	})
	.item({ // help
		priority : 15,
		icon : 'help',
		label : 'Help',
		tooltip : 'Display help in sidenav',
		visible : function(){
			return !!$route.current.helpId;
		},
		active : function(){
//			return $mdSidenav('help');
			$rootScope.showHelp = !$rootScope.showHelp;
			if($rootScope.showHelp){
				return $mdSidenav('help').toggle();
			}
		}
	});
	
	$app.newToolbar({
		id : 'dashboard',
		title : 'Dashboard toolbar',
		description : 'Main dashboard toolbar',
		controller: 'AmdToolbarMainCtrl',
		templateUrl : 'views/amd-toolbars/main.html',
	});
	
	$app.newSidenav({
		id : 'navigator',
		title : 'Navigator',
		description : 'Navigate all path and routs of the pandel',
		controller: 'AmdNavigatorCtrl',
		templateUrl : 'views/amd-sidenavs/navigator.html',
		locked : true,
		position : 'start',
	});
	$app.newSidenav({
		id : 'help',
		title : 'Help',
		description : 'System online help',
		controller : 'AmdHelpCtrl',
		templateUrl : 'views/amd-sidenavs/help.html',
		locked : true,
		visible : function() {
			return $rootScope.showHelp;
		},
		position : 'end'
	});
	$app.newSidenav({
		id : 'settings',
		title : 'Settings',
		description : 'User settings',
//		controller : 'AvaHelpCtrl',
		templateUrl : 'views/amd-sidenavs/settings.html',
		locked : false,
//		visible : function($scope) {
//			return $scope.showHelp;
//		},
		position : 'end'
	});
});