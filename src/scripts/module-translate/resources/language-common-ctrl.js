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

mblowfish.controller('MbLocalResourceLanguageCommonCtrl', function($scope, $http) {
	$http.get('resources/languages.json')
		.then(function(res) {
			$scope.languages = res.data;
		});

	this.setLanguage = function(lang) {
		$scope.$parent.setValue(lang);
	};


	//
	//	/**
	//	 * Create filter function for a query string
	//	 */
	//	function createFilterFor(query) {
	//		var lowercaseQuery = query.toLowerCase();
	//
	//		return function filterFn(language) {
	//			return (language.title.indexOf(lowercaseQuery) >= 0) ||
	//			(language.key.indexOf(lowercaseQuery) >= 0);
	//		};
	//
	//	}
});