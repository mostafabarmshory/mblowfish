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
 * @ngdoc Controllers
 * @name MbPreferencesCtrl
 * @description Manages preferences page
 * 
 * In the preferences page, all configs of the system are displayed and
 * users are able to change them. These preferences pages are related to
 * the current SPA usually.
 * 
 */
.controller('MbPreferencesCtrl',function($scope, $preferences) {

	/**
	 * Open a preference page
	 * 
	 * @memberof MbPreferencesCtrl
	 */
	function openPreference(page) {
		$preferences.openPage(page);
	}

	// Load settings
	$preferences.pages()//
	.then(function(list) {
		$scope.preferenceTiles = [];
		$scope.pages = [];
		for (var i = 0; i < list.items.length; i++) {
			var page = list.items[i];
			if(!page.hidden){ // Filter hidden items
				$scope.preferenceTiles.push({
					colspan : 1,
					rowspan : 1,
					page : page
				});
				$scope.pages.push(page);
			}
		}
	});
});
