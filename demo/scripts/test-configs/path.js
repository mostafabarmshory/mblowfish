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
	.otherwise('/dashboard')
	.when('/test/infinate-scrole', {
		controller : 'InfinateItemsCtrl',
		templateUrl : 'views/amd-test-infinate-scroll.html',
		navigate : true,
		groups : [ 'example', 'example2' ],
		name : 'Infinate scroll test',
		icon : 'load',
	})
	.when('/test/preloading', {
		templateUrl : 'views/amd-test-preload.html',
		navigate : true,
		groups : [ 'example', 'example2' ],
		name : 'Preloading test page',
		icon : 'load',
	})
	.when('/test/resources', {
		controller : 'SelectResourcesCtrl',
		templateUrl : 'views/amd-test-resources.html',
		navigate : true,
		groups : [ 'example' ],
		name : 'Select resource',
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
		icon : 'apps'
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
		//		controller: 'TablesClassTestCtrl',
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
	;
	// for(var i = 0; i <20; i++){
	// $routeProvider.when('/table'+i, {
	// controller : 'TableController',
	// template : '<h1>Hi</h1>',
	// config : {
	// name : 'Table',
	// sref : '.table',
	// navigate : true
	// }
	// })//
	// }
});