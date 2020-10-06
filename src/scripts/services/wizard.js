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
		mbDialog,
		mbSettings,
		Wizard,
		WizardPage,
		rootScope;

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

	function getWizard(wizardId) {
		if (!hasWizard(wizardId)) {
			throw {
				message: 'Wizard not found'
			};
		}
		return wizardConfigs[wizardId];
	}

	/**
	Checks if a wizard with given id exist
	
	@memberof $mbWizard
	@param wizardId {string} The id of the wizard
	 */
	function hasWizard(wizardId) {
		return !_.isUndefined(wizardConfigs[wizardId]);
	}

	function openWizardWithDialog(wizard, locals) {
		// Open with dialog
		mbDialog.show({
			template: '<md-dialog></md-dialog>',
			parent: angular.element(document.body),
			controller: function($scope, $mdDialog, $element) {
				'ngInject';
				$element
					.attr('dir', mbSettings.get(SETTING_LOCAL_DIRECTION, 'ltr'));
				wizard.render(_.assign({
					$scope: $scope,
					$element: $element.find('md-dialog'),
				}, locals || {}));

				wizard.on('finish', function() {
					$mdDialog.hide();
				});

				wizard.on('cancel', function() {
					$mdDialog.cancel();
				});
			},
		});
	}

	function openWizardWithElement(wizard, $element, locals) {
		// Open with in the $element
		$element
			.attr('dir', mbSettings.get(SETTING_LOCAL_DIRECTION, 'ltr'));
		wizard.render(_.assign({
			$scope: rootScope.$new(),
			$element: $element,
		}, locals || {}));
	}

	/**
	Opens a wizard with in a dialog and return the prommise to do
	final process.
	
	@memberof $mbWizard
	@param wizardId {string} The id of the wizard
	@param $element {JqueryDOM} the place to render the wizard
	 */
	function openWizard(wizardId, $event) {
		var $element = $event.locals.$element;
		var wizardConfig = getWizard(wizardId);
		var wizard = new Wizard(_.assign({}, wizardConfig));
		wizard.pages = [];
		// load pages
		_.forEach(wizardConfig.pages || [], function(pageId, index) {
			var page = getWizardPage(pageId);
			page.$wizard = wizard;
			page.index = index;
			wizard.pages.push(page);
		});
		if (_.isUndefined($element)) {
			openWizardWithDialog(wizard, $event.locals);
		} else {
			openWizardWithElement(wizard, $element, $event.locals);
		}
		return wizard;
	}

	/**
	Registers/Overrid a wizard page with given ID
	
	@memberof $mbWizard
	@param pageId {string} the id of the page
	@param wizardPageConfig {object} the configuration
	@return the $mbWizard service
	 */
	function addWizardPage(pageId, wizardPageConfig) {
		wizardPageConfigs[pageId] = wizardPageConfig;
		return service;
	}

	/**
	Creates new instance of a page with the given id
	
	@memberof $wizard
	@throws PageNotFoundException if the page not found.
	 */
	function getWizardPage(pageId) {
		if (!hasWizardPage(pageId)) {
			throw {
				message: 'Wizard page not found:' + pageId
			};
		}
		return new WizardPage(wizardPageConfigs[pageId]);
	}

	/**
	Checks if the page exists.
	
	@memberof $wizard
	@return true if the pageId exists
	 */
	function hasWizardPage(pageId) {
		return !_.isUndefined(wizardPageConfigs[pageId]);
	}

	//-----------------------------------------------------------------------------------
	// End
	//-----------------------------------------------------------------------------------
	service = {
		addWizard: addWizard,
		getWizard: getWizard,
		hasWizard: hasWizard,
		openWizard: function(id, $element){
			var $event = {
				locals: {}
			};
			if($element){
				$event.locals.$element = $element;
			}
			return openWizard(id, $event)
		},
		open: openWizard,

		addWizardPage: addWizardPage,
		getWizardPage: getWizardPage,
		hasWizardPage: hasWizardPage
	};
	provider = {
		$get: function(MbWizard, MbWizardPage, $mbDialog, $rootScope, $mbSettings) {
			'ngInject';
			Wizard = MbWizard;
			WizardPage = MbWizardPage;
			mbDialog = $mbDialog;
			rootScope = $rootScope;
			mbSettings = $mbSettings;

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
