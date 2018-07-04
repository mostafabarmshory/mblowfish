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

angular.module('app')//
/**
 * 
 */
.run(function($navigator, $app, $rootScope){
		// add category
	$navigator.newGroup({
		id: 'tables',
		title: 'Tables',
		icon: 'label',
		priority : 20
	});
	$navigator.newGroup({
		id: 'example',
		title: 'Examples',
		icon: 'face',
		priority : 20
	});
	$navigator.newGroup({
		id: 'navigator',
		title: 'Navigator',
		icon: 'navigator',
		priority : 20,
		hidden : 'navigatorGroupHiddenTestFlag'
	});
	$navigator.newGroup({
		id: 'pagination',
		title: 'Pagination',
		icon: 'lsit',
		priority : 20
	});
	$navigator.newGroup({
		id: 'example2',
		title: 'Examples 2',
		icon: 'edit',
		priority : 30
	});
	$navigator.newGroup({
		id: 'example2',
		title: 'Examples 2',
		icon: 'edit',
		priority : 30
	});
	$navigator.newGroup({
		id: 'sidenav',
		title: 'Sidenav',
		icon: 'list',
		priority : 40
	});
	$navigator.newGroup({
		id: 'help',
		title: 'Help',
		icon: 'help',
		priority : 40
	});
	$navigator.newGroup({
		id: 'mb-panel',
		title: 'MB Panel',
		icon: 'web',
		priority : 40
	});
	$navigator.newGroup({
		id: 'mb-toolbar',
		title: 'MB Toolbar',
		icon: 'toolbar',
		priority : 40
	});
	
	
	$navigator.newItem({
		type: 'link',
		link: 'https://gitlab.com/angular-material-dashboard/angular-material-dashboard/wikis/home',
		title: 'Online help',
		icon: 'help'
	});
	
	$app.newToolbar({
		id : 'testToolbar',
		title : 'Test toolbar',
		description : 'Main dashboard toolbar',
		controller: 'MbToolbarDashboardCtrl',
		templateUrl : 'views/toolbars/test.html',
		visible: function(){
			return $rootScope.testToolbar;
		}
	});
});
