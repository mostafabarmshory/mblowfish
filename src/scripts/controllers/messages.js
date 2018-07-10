'use strict';
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
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
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
 * @ngdoc Controllers
 * @name MessagesCtrl
 * @description Dashboard
 * 
 */
.controller('MessagesCtrl', function($scope, $usr, $monitor, PaginatorParameter) {

	var paginatorParameter = new PaginatorParameter();
	paginatorParameter.setOrder('id', 'd');
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
		return $usr.messages(paginatorParameter)//
		.then(function(items) {
			requests = items;
			ctrl.items = ctrl.items.concat(requests.items);
			ctrl.status = 'relax';
		}, function() {
			ctrl.status = 'fail';
		});
	}


	/**
	 * درخواست مورد نظر را از سیستم حذف می‌کند.
	 * 
	 * @param request
	 * @returns promiss
	 */
	function remove(pobject) {
		return pobject.delete()//
		.then(function(){
			var index = ctrl.items.indexOf(pobject);
			if (index > -1) {
				ctrl.items .splice(index, 1);
			}
			if(ctrl.items.length === 0){
				reload();
			}
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
//		ctrl.status = 'relax';
		return nextPage();
	}

	/*
	 * تمام امکاناتی که در لایه نمایش ارائه می‌شود در اینجا نام گذاری
	 * شده است.
	 */

	$scope.items = [];
	$scope.reload = reload;
	$scope.search = find;
	$scope.nextMessages = nextPage;
	$scope.remove = remove;
	$scope.ctrl = ctrl;
	$scope.pp = paginatorParameter;

	// watch messages
	var handler;
	$monitor.monitor('message', 'count')//
	.then(function(monitor){
		handler = monitor.watch(function(){
			reload();
		});
	});
	$scope.$on('$destroy', handler);
	/*
	 * مقداردهی اولیه
	 */
	reload();
});
