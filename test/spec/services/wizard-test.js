/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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
describe('Service $mbWizard ', function() {

	//------------------------------------------------------------------------------------
	// Test Data
	//------------------------------------------------------------------------------------
	var $mbStorage;
	var MbWizard;
	var $mbWizard;
	/*
	register a wizard
	*/
	var wizardIdRuntime = 'wizard.test.' + Math.random();
	var wizardRuntimeConfig = {
		title: 'title-' + Math.random(),
		description: 'description-' + Math.random(),
		pages: [
			'userIputText'
		]
	};
	var userIputTextConfig = {
		template: '<input></input>',
	};
	mblowfish
		.wizard(wizardIdRuntime, wizardRuntimeConfig)
		.wizardPage('userIputText', userIputTextConfig);

	//------------------------------------------------------------------------------------
	// Test configs
	//------------------------------------------------------------------------------------
	// instantiate service
	beforeEach(function() {
		module('mblowfish-core');
		inject(function(_$mbWizard_, _MbWizard_) {
			$mbWizard = _$mbWizard_;
			MbWizard = _MbWizard_;
		});
	});

	//------------------------------------------------------------------------------------
	// Tests
	//------------------------------------------------------------------------------------
	it('should register a wizard and check if it exist directly', function() {
		var wizardId = 'wizard.test.' + Math.random();
		$mbWizard.addWizard(wizardId, {});
		expect($mbWizard.hasWizard(wizardId)).toBe(true);
	});

	it('should register a wizard at runtime', function() {
		expect($mbWizard.hasWizard(wizardIdRuntime)).toBe(true);
	});

	it('should fail to get and unregisterd wizard ', function() {
		var wizardId = 'wizard.test.notfound.' + Math.random();
		expect($mbWizard.hasWizard(wizardId)).toBe(false);
	});

	it('should render a wizard on custom element', function() {
		var $element = mblowfish.element('<div></div>');
		var wizard = $mbWizard.openWizard(wizardIdRuntime, {
			$element: $element
		});
		
		expect(wizard).not.toBe(undefined);
		expect(wizard instanceof MbWizard).toBe(true);
//		expect($element.find('input')).not.toBe(null);
	});
});
