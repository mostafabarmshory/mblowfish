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
	 * @ngdoc Directives
	 * @name mb-pagination-bar
	 * @property {Object}    mb-model           -Data model
	 * @property {function}  mb-reload          -Reload function
	 * @property {Array}     mb-sort-keys       -Array
	 * @property {Array}     mb-more-actions    -Array
	 * @property {string}    mb-title           -String
	 * @property {string}    mb-icon            -String
	 * @description Pagination bar
	 *
	 * Pagination parameters are a complex data structure and it is hard to manage
	 * it. This is a toolbar to manage the pagination options.
	 */
	.directive('mbPaginationBar', function ($window, $timeout, $mdMenu, $parse) {

	    function postLink(scope, element, attrs) {

		var query = {
		    sortDesc: true,
		    sortBy: typeof scope.mbSortKeys === 'undefined' ? 'id' : scope.mbSortKeys[0],
		    searchTerm: null
		};
		/*
		 * مرتب سازی مجدد داده‌ها بر اساس حالت فعلی
		 */
		function __reload() {
		    if (!angular.isDefined(attrs.mbReload)) {
			return;
		    }
		    $parse(attrs.mbReload)(scope.$parent);
		}
		/**
		 * ذخیره اطلاعات آیتم‌ها بر اساس مدل صفحه بندی
		 */
		function exportData() {
		    if (!angular.isFunction(scope.mbExport)) {
			return;
		    }
		    scope.mbExport(scope.mbModel);
		}

		function searchQuery() {
		    scope.mbModel.setQuery(scope.query.searchTerm);
		    __reload();
		}

		function focusToElementById(id) {
		    $timeout(function () {
			var searchControl;
			searchControl = $window.document.getElementById(id);
			searchControl.focus();
		    }, 50);
		}
		
		function setSortOrder () {
		    scope.mbModel.clearSorters();
		    var key = scope.query.sortBy;
		    var order = scope.query.sortDesc ? 'd' : 'a';
		    scope.mbModel.addSorter(key,order);
		    __reload();
		}

		scope.showBoxOne = false;
		scope.focusToElement = focusToElementById;
		// configure scope:
		scope.searchQuery = searchQuery;
		scope.setSortOrder = setSortOrder;
		scope.__reload = __reload;
		scope.query = query;
		if (angular.isFunction(scope.mbExport)) {
		    scope.exportData = exportData;
		}
		if (typeof scope.mbEnableSearch === 'undefined') {
		    scope.mbEnableSearch = true;
		}
	    }

	    return {
		restrict: 'E',
		templateUrl: 'views/directives/mb-pagination-bar.html',
		scope: {
		    /*
		     * مدل صفحه بندی را تعیین می‌کند که ما اینجا دستکاری می‌کنیم.
		     */
		    mbModel: '=',
		    /*
		     * تابعی را تعیین می‌کند که بعد از تغییرات باید برای مرتب سازی
		     * فراخوانی شود. معمولا بعد تغییر مدل داده‌ای این تابع فراخوانی می‌شود.
		     */
		    mbReload: '@?',
		    /*
		     * تابعی را تعیین می‌کند که بعد از تغییرات باید برای ذخیره آیتم‌های موجود در لیست
		     * فراخوانی شود. این تابع معمولا باید بر اساس تنظیمات تعیین شده در مدل داده‌ای کلیه آیتم‌های فهرست را ذخیره کند.
		     */
		    mbExport: '=',
		    /*
		     * یک آرایه هست که تعیین می‌که چه کلید‌هایی برای مرتب سازی باید استفاده
		     * بشن.
		     */
		    mbSortKeys: '=',

		    /* titles corresponding to sort keys */
		    mbSortKeysTitles: '=?',

		    /*
		     * فهرستی از عمل‌هایی که می‌خواهیم به این نوار ابزار اضافه کنیم
		     */
		    mbMoreActions: '=',

		    mbTitle: '@?',
		    mbIcon: '@?',

		    mbEnableSearch: '=?'
		},
		link: postLink
	    };
	});
