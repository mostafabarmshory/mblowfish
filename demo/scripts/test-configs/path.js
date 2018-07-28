/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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

angular.module('app') //
/**
 * 
 */
.config(function($routeProvider) {

	// add routes
	$routeProvider //
	.otherwise('/test/preloading')
	.when('/test/infinate-scrole', {
		controller : 'InfinateItemsCtrl',
		templateUrl : 'views/amd-test-infinate-scroll.html',
		navigate : true,
		groups : [ 'example', 'example2' ],
		name : 'Infinate scroll test',
		icon : 'load',
		helpId: 'preloading-test'
	})
	.when('/test/preloading', {
		templateUrl : 'views/amd-test-preload.html',
		navigate : true,
		groups : [ 'example', 'example2' ],
		name : 'Preloading test page',
		icon : 'load',
	})
	.when('/test/inline', {
		controller : 'InlineEditCtrl',
		templateUrl : 'views/amd-test-inline.html',
		navigate : true,
		groups : [ 'example' ],
		name : 'Inline edit',
		icon : 'edit',
	})
	.when('/test/pagination', {
		controller : 'TestPaginationBarCtrl',
		templateUrl : 'views/amd-test-pagination-bar.html',
		navigate : true,
		groups : [ 'pagination' ],
		name : 'Pagination Bars',
		icon : 'apps',
	})
	
	// Navigators
	.when('/test/navigator/hidden', {
		controller : 'TestNavigatorHiddenPathCtrl',
		templateUrl : 'views/amd-test-navigator-hidden.html',
		navigate : true,
		groups : [ 'navigator' ],
		name : 'Hidden navigator',
		icon : 'apps',
		hidden : 'navigatorHiddenTestFlag'
	})
	.when('/test/navigator/dialogs', {
		controller : 'TestNavigatorDialogsCtrl',
		templateUrl : 'views/amd-test-navigator-dialogs.html',
		navigate : true,
		groups : [ 'navigator' ],
		name : 'Dialogs',
		icon : 'apps',
		hidden: 'navigatorHiddenTestFlag2'
	})


	.when('/test/titled-block', {
		controller : 'TitledBlockCtrl',
		templateUrl : 'views/amd-test-titled-block.html',
		navigate : true,
		groups : [ 'example' ],
		name : 'Titled Block',
		icon : 'apps',
	})

	.when('/test/table/general', {
		controller : 'TablesClassTestCtrl',
		templateUrl : 'views/amd-test-tables.html',
		navigate : true,
		groups : [ 'tables' ],
		name : 'Tables class',
		icon : 'apps',
	})


	.when('/test/date/general', {
	    controller: function($scope){
	        $scope._date = '2018-01-01 00:00:00';
	        $scope._dateUndef = undefined;
	    },
		templateUrl : 'views/amd-test-amddate.html',
		navigate : true,
		//			groups: ['tables'],
		name : 'Date',
		icon : 'apps',
	})

	.when('/test/sidenave/config', {
		//		controller: 'TablesClassTestCtrl',
		templateUrl : 'views/amd-test-sidenav-config.html',
		navigate : true,
		groups : [ 'sidenav' ],
		name : 'Sidenav panel config:display',
		icon : 'list',
	})
	.when('/test/sidenave/no-sidenav', {
		templateUrl : 'views/amd-test-sidenav-config.html',
		navigate : true,
		groups : [ 'sidenav' ],
		sidenavs: [],
		name : 'No sidenave',
		icon : 'list',
	})
	
	
	.when('/test/help/basic', {
	    controller: 'TestHelpCtrl',
	    templateUrl : 'views/mb-test-help.html',
	    navigate : true,
	    groups : [ 'help' ],
	    name : 'Open help for item',
	    icon : 'help',
	})
	
	
	
	.when('/test/panel/protect', {
	    controller: 'TestHelpCtrl',
	    templateUrl : 'views/mb-test-help.html',
	    navigate : true,
	    groups : [ 'mb-panel' ],
	    name : 'Protected page',
	    icon : 'help',
	    protect: true
	})
	
	.when('/test/panel/protect-function', {
	    controller: 'TestHelpCtrl',
	    templateUrl : 'views/mb-test-help.html',
	    navigate : true,
	    groups : [ 'mb-panel' ],
	    name : 'Protected page (function)',
	    icon : 'help',
	    /*
	     * Add injection annotation if you are interested to inject
	     * a service.
	     * 
	     * @ngInject
	     */
	    protect: function($rootScope){
	        if(!$rootScope.app.user.owner){
	            alert('You are not owner');
	            return true;
	        }
	        return false;
	    }
	})
	.when('/test/panel/protect-function-denied', {
	    controller: 'TestHelpCtrl',
	    templateUrl : 'views/mb-test-help.html',
	    navigate : true,
	    groups : [ 'mb-panel' ],
	    name : 'Protected page - denied(function)',
	    icon : 'help',
	    protect: function(){
	        return true;
	    }
	})
	.when('/test/toolbar/toolbar-visible', {
		controller: 'TestToolbarCtrl',
		templateUrl : 'views/mb-test-toolbar.html',
		navigate : true,
		groups : [ 'mb-toolbar' ],
		name : 'Toolbar visible',
		icon : 'settings',
		toolbars: ['testToolbar']
	})
	;
});