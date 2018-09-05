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

angular.module('app')
/**
 * 
 */
.controller('InfinateItemsCtrl', function($scope, $navigator, $q, $timeout, QueryParameter) {
	var ctrl = {
			state: 'relax',
			items: []
	};

	function getItems(){
		var defer = $q.defer();
		$timeout(function () {
			var items={
					items:[],
			};
			for(var i = 0; i < 20; i++){
				items.items.push({
					title: 'title',
					subTitle: 'sub title',
					description: 'description of :' + Math.random()
				});
			}
			defer.resolve(items);
		}, 2000);
		return defer.promise;
	}

	/**
	 * Loading next page
	 * 
	 * @returns
	 */
	function nextPage() {
		if (ctrl.state === 'working') {
			return;
		}
		// start state (device list)
		ctrl.state = 'working';
		getItems()//
		.then(function(items) {
			ctrl.items = ctrl.items.concat(items.items);
			ctrl.state = 'relax';
		});
	}


	/**
	 * Reload data
	 * 
	 * @returns
	 */
	function reload(){
		ctrl.items = [];
		nextPage();
	}

	/*
	 * تمام امکاناتی که در لایه نمایش ارائه می‌شود در اینجا نام گذاری
	 * شده است.
	 */
	$scope.items = [];
	$scope.nextPage = nextPage;
	$scope.ctrl = ctrl;
	$scope.reload = reload;
	
	$scope.paginatorParameter = new QueryParameter();
	$scope.sortKeys = [
		'id', 
		'name'
		];
	$scope.moreActions = [{
		title: 'Greeting',
		icon: 'add',
		action: function(){alert('hi')} 
	}];
});
