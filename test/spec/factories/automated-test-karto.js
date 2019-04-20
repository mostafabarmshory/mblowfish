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
	beforeEach(module('mblowfish-core'));
	beforeEach(inject(function(_$injector_) {
		$injector = _$injector_;
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
	function KoratFactoryTestSpace(factoryName){
		this.factoryName = factoryName;
		this.loaded = false;
	}

	KoratFactoryTestSpace.prototype.load = function() {
		// create an instance of controller
		var Factory = $injector.get(this.factoryName);
		expect(Factory).not.toBe(null);
		this.mainInstance = new Factory();
		expect(this.mainInstance).not.toBe(null);


		this.loaded = true;
	};
	
	KoratFactoryTestSpace.prototype.hasNextCandidate = function() {
		this.checkPreconditions();
		
		return false
	};
	
	KoratFactoryTestSpace.prototype.nextCandidate = function() {
		this.checkPreconditions();
	};
	
	KoratFactoryTestSpace.prototype.checkPreconditions = function(){
		if(!this.loaded) {
			throw "The test space must be load befor any test";
		}
	};

	/***********************************************************************
	 * Our controllers
	 ***********************************************************************/
	var factoriesName = [
		// old version compatiblitiy
		'Action',
		'ActionGroup',
		// New version
		'MbEvent',
		'MbAction',
		'MbActionGroup',
		];

	angular.forEach(factoriesName, function(factoryName){
		var testSpace  = new KoratFactoryTestSpace(factoryName);

		it('of ' + factoryName + ' should pass all test based on Korat', function() {
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
