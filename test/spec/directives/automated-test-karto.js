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

/**
 * One of the most important part of AngularJS application are controllers. So, well
 * tested controllers directly effects the software quality.
 * 
 * In this test I try to implement a simple and light automated test. Them main idea
 * is taken from Korat[1] but this is a very simple implementation.
 * 
 * @returns
 */
describe('Automate test ', function() {
	'use strict';
	var $injector;
	var $rootScope;
	var $compile;
	beforeEach(module('mblowfish-core'));
	beforeEach(inject(function(_$injector_, _$rootScope_, _$compile_) {
		$injector = _$injector_;
		$rootScope = _$rootScope_;
		$compile = _$compile_;
	}));

	/********************************************************************
	 * Test space
	 ********************************************************************/
	/**
	 * 
	 */
	function KoratObjectParser(){}

	/**
	 * Applies finitization to the test space
	 */
	KoratObjectParser.prototype.getFinitization = function(testSpace){};


	var KoratObjectHolder = function(refrence){
		this.refrence = refrence;
	}

	KoratObjectHolder.prototype.invokePredicate = function(){
		// XXX: maso, 2019
	}

	/**
	 * 
	 */
	function KoratDirectiveTestSpace(directiveName){
		this.directiveName = directiveName;
		this.loaded = false;
	}

	KoratDirectiveTestSpace.prototype.load = function() {
		// create an instance
		var element = angular.element('<'+ this.directiveName +' ng-model="a"></' + this.directiveName+'>');
		var scope = $rootScope.$new();
		var compiledElement = $compile(element)(scope);
		scope.$digest();

		this.mainInstance = compiledElement
		expect(this.mainInstance).not.toBe(null);

		this.loaded = true;
	};

	KoratDirectiveTestSpace.prototype.hasNextCandidate = function() {
		this.checkPreconditions();

		return false
	};

	KoratDirectiveTestSpace.prototype.nextCandidate = function() {
		this.checkPreconditions();
	};

	KoratDirectiveTestSpace.prototype.checkPreconditions = function(){
		if(!this.loaded) {
			throw "The test space must be load befor any test";
		}
	};

	/***********************************************************************
	 * Our controllers
	 ***********************************************************************/
	// XXX: requires ngModel
	// XXX: this is attribute
	var directivesName = [
		'compare-to', 
		'mb-badge',
//		'mb-captcha', XXX: requres key for google and GET HTTP
		'mb-context-menu',
		'mb-datepicker', // XXX: requires ngModel
		'mb-dynamic-form',
		'mb-dynamic-tabs',
		'mb-error-messages',
//		'mb-infinate-scroll', 
		'mb-panel',
//		'mb-pay' XXX: requires ngModel
		];

	angular.forEach(directivesName, function(directiveName){
		var testSpace  = new KoratDirectiveTestSpace(directiveName);

		it('of ' + directiveName + ' should pass all test based on Korat', function() {
			testSpace.load();
			while (testSpace.hasNextCandidate()) {
				var candidate = testSpace.nextCandidate();
				try {
					if (candidate.invokePredicate()){
//						output(candidate);
						console.log("Hi");
					}
				} catch (error) {
					// TODO: Report the problem??
				}
//				backtrack();
			}
		});
	});

});
