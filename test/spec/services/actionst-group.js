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

describe('Actions service', function() {

	// load the controller's module
	beforeEach(module('mblowfish-core'));

	var $actions;
	var $rootScope;
	var $timeout;

	// Initialize the controller and a mock scope
	beforeEach(inject(function(_$actions_, _$rootScope_, _$timeout_) {
		$actions = _$actions_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;
	}));

	it('should attach function to add a group', function() {
		expect(angular.isFunction($actions.newGroup)).toBe(true);
	});

	it('should attach function to get a group', function() {
		expect(angular.isFunction($actions.group)).toBe(true);
	});

	it('should attach function to get groups', function() {
		expect(angular.isFunction($actions.groups)).toBe(true);
	});

	var groupData = {
			id: 'example',
			title: 'title',
			description: 'example',
	};


	it('soulds load attributes of auto created group', function (){
		var group = $actions.group(groupData.id)
		expect(group).not.toBe(null);

		var g2 = $actions.newGroup(groupData)
		expect(g2).not.toBe(null);
		expect(g2.title).toBe(groupData.title);
	});
});
