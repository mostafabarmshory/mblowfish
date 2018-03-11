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
 * @ngdoc controller
 * @name MainController
 * @description Dashboard
 * 
 */
.controller('MainController2',function($scope, $navigator, $mdSidenav, $mdBottomSheet, $log, $q,
		$mdToast, $usr, $route, $location, $monitor, $rootScope,
		$app) {

	var vm = $scope;

	vm.menuItems = [];
	vm.selectItem = selectItem;
	vm.toggleItemsList = toggleItemsList;
	vm.showActions = showActions;
	// vm.title = $route.current.config.title;
	vm.showSimpleToast = showSimpleToast;
	vm.toggleSidebar = toggleSidebar;
	vm.toggleRightSidebar = toggleRightSidebar;

	$navigator.loadAllItems()//
	.then(function(menuItems) {
		vm.menuItems = [].concat(menuItems);
	});


	// $view service
	function toggleRightSidebar() {
		toggleSidebar('right');
	}

	function toggleSidebar(id) {
		return $mdSidenav(id).toggle();
	}

	function toggleItemsList() {
		var pending = $mdBottomSheet.hide() || $q.when(true);
		pending.then(function() {
			toggleSidebar('left');
		});
	}

	function selectItem(item) {
		vm.title = item.config.name;
		vm.toggleItemsList();
		vm.showSimpleToast(vm.title);
	}

	// $shortcut service
	function showActions($event) {
		$mdBottomSheet.show(
				{
					parent : angular.element(document
							.getElementById('content')),
							templateUrl : 'views/partials/bottomSheet.html',
							controller : [ '$mdBottomSheet', SheetController ],
							controllerAs : "vm",
							bindToController : true,
							targetEvent : $event
				}).then(function(clickedItem) {
					clickedItem && $log.debug(clickedItem.name + ' clicked!');
				});

		function SheetController($mdBottomSheet) {
			var vm = this;
			vm.actions = [ {
				name : 'Share',
				icon : 'share',
				url : 'https://tinc'
			}, {
				name : 'Star',
				icon : 'star',
				url : 'https://stargazers'
			} ];

			vm.performAction = function(action) {
				$mdBottomSheet.hide(action);
			};
		}
	}


	// $notify service
	function showSimpleToast(title) {
		$mdToast.show($mdToast.simple().content(title).hideDelay(2000)
				.position('bottom right'));
	}

	// Message service
	$monitor.monitor('message', 'count')//
	.then(function(monitor){
		$scope.messageMonitor = monitor;
	})
});
