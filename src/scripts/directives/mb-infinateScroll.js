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
 * @name mb-infinate-scroll
 * @description Infinet scroll 
 * 
 * 
 * Manage scroll of list 
 */
.directive('mbInfinateScroll', function($parse) {
	// FIXME: maso, 2017: tipo in diractive name (infinite)
	function postLink(scope, elem, attrs) {
		// adding infinite scroll class
		elem.addClass('mb-infinate-scroll');
		elem.on('scroll', function(evt) {
			var raw = elem[0];
			if (raw.scrollTop + raw.offsetHeight  + 5 >= raw.scrollHeight) {
				$parse(attrs.mbInfinateScroll)(scope);
			}
	 	});
		// Call the callback for the first time:
		$parse(attrs.mbInfinateScroll)(scope);
	}

	return {
		restrict : 'A',
		link : postLink
	};
});
