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
 * @ngdoc directive
 * @name amd-pagination-bar
 * @property {Object}    amd-model           -Data model
 * @property {function}  amd-reload          -Reload function
 * @property {Array}     amd-sort-keys       -Array
 * @property {Array}     amd-more-actions    -Array
 * @property {string}    amd-title           -String
 * @property {string}    amd-icon            -String
 * @description Pagination bar
 * 
 * Pagination parameters are a complex data structure and it is hard to manage
 * it. This is a toolbar to manage the pagination options.
 */
.directive('amdPaginationBar', function() {

	function postLink(scope, element, attr) {

		var query = {
			sortDesc: true,
			sortBy: typeof scope.amdSortKeys === 'undefined' ? 'id' : scope.amdSortKeys[0],
			searchTerm: null
		};
		/*
		 * مرتب سازی مجدد داده‌ها بر اساس حالت فعلی 
		 */
		function reload(){
			if(!angular.isFunction(scope.amdReload)){
				return;
			}
			scope.amdReload(scope.amdModel);
		}
		/**
		 * ذخیره اطلاعات آیتم‌ها بر اساس مدل صفحه بندی
		 */
		function exportData(){
			if(!angular.isFunction(scope.amdExport)){
				return;
			}
			scope.amdExport(scope.amdModel);
		}

		function searchQuery(searchText){
			scope.amdModel.setQuery(searchText);
			scope.amdReload();
		}

		function init(){
			// Checks sort key
			if(scope.amdModel){
				// clear previous sorters
				// TODO: replace it with scope.amdModel.clearSorters() 
				scope.amdModel.sortMap = {};
				scope.amdModel.filterMap = {};
				scope.amdModel.setOrder(query.sortBy, query.sortDesc ? 'd' : 'a');
				scope.amdModel.setQuery(query.searchTerm);
			}
		}

		// configure scope:
		scope.search = searchQuery;
		scope.query=query;
		if(angular.isFunction(scope.amdReload)){
			scope.reload = reload;
		}
		if(angular.isFunction(scope.amdExport)){
			scope.exportData = exportData;
		}
		if(typeof scope.amdEnableSearch === 'undefined'){
			scope.amdEnableSearch = true;
		}
		
		scope.$watch('amdModel', function(){
			init();
		});

		scope.$watch('query', function(){
			// Reloads search
			init();
			reload();
		}, true);

	}

	return {
		restrict : 'E',
		templateUrl: 'views/directives/amd-pagination-bar.html',
		scope : {
			/*
			 * مدل صفحه بندی را تعیین می‌کند که ما اینجا دستکاری می‌کنیم. 
			 */
			amdModel : '=',
			/*
			 * تابعی را تعیین می‌کند که بعد از تغییرات باید برای مرتب سازی
			 * فراخوانی شود. معمولا بعد تغییر مدل داده‌ای این تابع فراخوانی می‌شود.
			 */
			amdReload : '=',
			/*
			 * تابعی را تعیین می‌کند که بعد از تغییرات باید برای ذخیره آیتم‌های موجود در لیست
			 * فراخوانی شود. این تابع معمولا باید بر اساس تنظیمات تعیین شده در مدل داده‌ای کلیه آیتم‌های فهرست را ذخیره کند.
			 */
			amdExport : '=',
			/*
			 * یک آرایه هست که تعیین می‌که چه کلید‌هایی برای مرتب سازی باید استفاده
			 * بشن.
			 */
			amdSortKeys: '=',
			/*
			 * فهرستی از عمل‌هایی که می‌خواهیم به این نوار ابزار اضافه کنیم
			 */
			amdMoreActions: '=',

			amdTitle: '@?',
			amdIcon: '@?',

			amdEnableSearch: '=?'
		},
		link : postLink
	};
});
