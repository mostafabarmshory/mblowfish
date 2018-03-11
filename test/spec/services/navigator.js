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

describe('Navigator service', function() {

	// load the controller's module
	beforeEach(module('mblowfish-core'));

	var $navigator;

	// Initialize the controller and a mock scope
	beforeEach(inject(function(_$navigator_) {
		$navigator = _$navigator_;			
	}));
	
	it('should attach function to add an item', function() {
		expect(angular.isFunction($navigator.newItem)).toBe(true);
	});

//	it('should item exist in items after a new one added', function() {
//		var item = {
//				
//		};
//	});

	it('should attach function to list items', function() {
		expect(angular.isFunction($navigator.items)).toBe(true);
	});

	it('should attach function to list groups', function() {
		expect(angular.isFunction($navigator.groups)).toBe(true);
	});
	
	it('should attach function to add group', function() {
		expect(angular.isFunction($navigator.newGroup)).toBe(true);
	});
	
	it('should attach function to get group', function() {
		expect(angular.isFunction($navigator.group)).toBe(true);
	});
});
