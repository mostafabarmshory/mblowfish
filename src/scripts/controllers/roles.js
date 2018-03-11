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
 * @name AmdRolesResourceCtrl
 * @description Role resource
 */
.controller('AmdRolesResourceCtrl', function($scope, $usr, PaginatorParameter ) {

	var paginatorParameter = new PaginatorParameter();
	paginatorParameter.setOrder('id', 'a');
	var requests = null;
	var ctrl = {
			state: 'relax',
			items: []
	};

	/**
	 * جستجوی درخواست‌ها
	 * 
	 * @param paginatorParameter
	 * @returns promiss
	 */
	function find(query) {
		paginatorParameter.setQuery(query);
		return reload();
	}

	/**
	 * لود کردن داده‌های صفحه بعد
	 * 
	 * @returns promiss
	 */
	function nextPage() {
		if (ctrl.status === 'working') {
			return;
		}
		if (requests && !requests.hasMore()) {
			return;
		}
		if (requests) {
			paginatorParameter.setPage(requests.next());
		}
		// start state (device list)
		ctrl.status = 'working';
		return $usr.roles(paginatorParameter)//
		.then(function(items) {
			requests = items;
			ctrl.items = ctrl.items.concat(requests.items);
			ctrl.status = 'relax';
		}, function() {
			ctrl.status = 'fail';
		});
	}

	/**
	 * تمام حالت‌های کنترل ررا بدوباره مقدار دهی می‌کند.
	 * 
	 * @returns promiss
	 */
	function reload(){
		requests = null;
		ctrl.items = [];
		return nextPage();
	}

	function selectRoleId(role){
		$scope.$parent.setValue(role.id);
	}
	
	/*
	 * تمام امکاناتی که در لایه نمایش ارائه می‌شود در اینجا نام گذاری
	 * شده است.
	 */
	$scope.items = [];
	$scope.reload = reload;
	$scope.search = find;
	$scope.nextPage = nextPage;
	$scope.ctrl = ctrl;
	$scope.selectRoleId = selectRoleId;
	
	$scope.paginatorParameter = paginatorParameter;
	$scope.sortKeys = [
		'id', 
		'name'
		];
//	$scope.moreActions = [{
//	title: 'New role',
//	icon: 'add',
//	action: function(){
//	alert('well done');
//	}
//	}];

	/*
	 * مقداردهی اولیه
	 */
//	reload();
});
