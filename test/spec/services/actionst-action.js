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

	// Initialize the controller and a mock scope
	beforeEach(inject(function(_$actions_, _$rootScope_) {
		$actions = _$actions_;			
		$rootScope = _$rootScope_;
	}));

	it('should attach function to add an action', function() {
		expect(angular.isFunction($actions.newAction)).toBe(true);
	});

	it('should attach function to get an action', function() {
		expect(angular.isFunction($actions.action)).toBe(true);
	});

	it('should attach function to get actions', function() {
		expect(angular.isFunction($actions.actions)).toBe(true);
	});


	var actionData = {
			id: 'test.action.1',
			icon: 'face',
			title: 'title',
			description: 'des',
			visible : function(){
				// TODO;
			},
			enable: true,
			priority: 100,
			groups: ['test1', 'test2'],
	}

	it('should create an action', function(){
		// create action
		var action = $actions.newAction(actionData);
		expect(action).not.toBe(null);

		// get test group
		for(var i = 0; i < actionData.groups.length; i++){
			var group = $actions.group(actionData.groups[i]);
			expect(group.items.indexOf(action) > -1).toBe(true);
		}
	});

	it('should distroy an action of scope', function(){
		// create action
		var testScope = $rootScope.$new();
		var action = $actions.newAction(angular.merge({
			scope: testScope,
		}, actionData));
		expect(action).not.toBe(null);

		// get test group
		for(var i = 0; i < actionData.groups.length; i++){
			var group = $actions.group(actionData.groups[i]);
			expect(group.items.indexOf(action) > -1).toBe(true);
		}
		
		testScope.$destroy();
		
		action = $actions.action(actionData.id);
		expect(angular.isDefined(action)).toBe(false);
		for(var i = 0; i < actionData.groups.length; i++){
			var group = $actions.group(actionData.groups[i]);
			expect(group.items.indexOf(action) > -1).toBe(false);
		}
	});
});
