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
@ngdoc Serivces
@name $mbWizard
@description Manages wizards and run

 */
mblowfish.provider('$mbWizard', function() {

	//-----------------------------------------------------------------------------------
	// Service and Factory
	//-----------------------------------------------------------------------------------
	var provider,
		service,
		Wizard,
		WizardPage;

	//-----------------------------------------------------------------------------------
	// Variables
	//-----------------------------------------------------------------------------------
	var wizardConfigs = {},
		wizardPageConfigs = {};


	//-----------------------------------------------------------------------------------
	// functions
	//-----------------------------------------------------------------------------------
	function addWizard(wizardId, wizardConfig) {
		wizardConfigs[wizardId] = wizardConfig;
		return service;
	}
	function getWizard() { }

	/**
	Checks if a wizard with given id exist
	
	@memberof $mbWizard
	@param wizardId {string} The id of the wizard
	 */
	function hasWizard(wizardId) {
		return !_.isUndefined(wizardConfigs[wizardId]);
	}


	/**
	Opens a wizard with in a dialog and return the prommise to do
	final process.
	
	@memberof $mbWizard
	@param wizardId {string} The id of the wizard
	 */
	function openWizard(wizardId) {
		if (!hasWizard(wizardId)) {
			throw {
				message: 'Wizard with the given wizard id not found: ' + wizardId
			};
		}
		// XXX: open within a dialog
		var wizardConfig = wizardConfigs[wizardId];
		var wizard = new Wizard(wizardConfig);


		return wizard;
	}

	function addWizardPage(pageId, wizardPageConfig) {
		wizardConfigs[pageId] = wizardPageConfig;
		return service;
	}
	function getWizardPage() { }
	function hasWizardPage() { }

	//-----------------------------------------------------------------------------------
	// End
	//-----------------------------------------------------------------------------------
	service = {
		addWizard: addWizard,
		getWizard: getWizard,
		hasWizard: hasWizard,
		openWizard: openWizard,

		addWizardPage: addWizardPage,
		getWizardPage: getWizardPage,
		hasWizardPage: hasWizardPage
	};
	provider = {
		$get: function(MbWizard, MbWizardPage) {
			'ngInject';
			Wizard = MbWizard;
			WizardPage = MbWizardPage;
			
			return service;
		},
		addWizard: function(wizardId, wizardConfig) {
			addWizard(wizardId, wizardConfig);
			return provider;
		},
		addWizardPage: function(pageId, wizardPageConfig) {
			addWizardPage(pageId, wizardPageConfig);
			return provider;
		}
	}
	return provider;
});
