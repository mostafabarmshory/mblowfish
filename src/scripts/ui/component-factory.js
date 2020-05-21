/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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
@ngdoc Factories
@name MbComponent
@description A basic UI Component wich is used to build views, editor, tooblars and others.
@public
@type {Object}

@property {string}  id           - The identitifier of the component. Must be unique in a list
@property {string}  url          - An alias fo the id
@property {boolean} isEditor     - A falg used for editors (special types of ui Components)
@property {boolean} isView       - A flag used for views (special types of UI components)
@property {boolean} isToolbar    - Is a toolbar
@property {boolean} isMenu       - Is a menu
@property {boolean} isComponent  - This is a basic UI component and must be used inside other components
@property {string}  title        - Title of the UI component
@property {string}  description  - A brife description of the UI component.
@property {string}  icon         - An Icon to display for the component
@property {string}  template     - A HTML text used as a UI for the component
@property {string}  templateUrl  - A URL of HTML resources to use as UI of the component
@property {string}  controller   - Name of a controller to used with UI
@property {string}  controllerAs - Alias of the controller in the UI
@property {number}  priority     - the priority of the component in the component list for example in toolbar

UI component is the basic of the whoule view. All part wil be registerd as a UI component such as a menu, toolbar,
view, or an editor.


@tutorial ui-component-action
 */
angular.module('mblowfish-core').factory('MbComponent', function(
	/* Angularjs */ $rootScope, $compile, $controller, $q,
	/* Mblowfish */ $mbUiUtil) {

	/*
	Create new instance of a UI component. It may used as view, editor
	or other part of UI.
	
	@memberof MbComponent
	@constructor
	@param {object} configs - A configuration set to crate a new instance
	*/
	function MbComponent(configs) {
		_.assignIn(this, configs, {
			// global attributes
			id: undefined,
			isEditor: false,
			isView: false,
			isToolbar: false,
			isMenu: false,
			isComponent: true,
			title: undefined,
			description: undefined,
			template: undefined,
			templateUrl: undefined,
			controller: undefined,
			controllerAs: undefined,
			priority: 0,
		});

		// $element, $controller, $scope pairs
		this.$binds = [];
		return this;
	};

	/**
	Gets template of the component
	
	Template is a HTML text which is used to build a view of the component.
	
	@returns {promisse} To resolve the template value
	@memberof MbComponent
	 */
	MbComponent.prototype.getTemplate = function() {
		return $q.when(this.template || $mbUiUtil.getTemplateFor(this));
	}


	/**
	Checks if the component is visible anywhare
	
	A component is visible if there is a paire of MVC item. For example an action is visible if
	it is created and append to the view by MVC elements.
	
	@returns {boolean} True if the component is visible.
	@memberof MbComponent
	 */
	MbComponent.prototype.isVisible = function() {
		return this.$binds.length > 0;
	}


	/**
	
	@memberof MbComponent
	 */
	MbComponent.prototype.render = function(locals) {
		var cmp = this;
		var paires = {
			$controller: undefined,
			$element: undefined,
			$scope: undefined
		};
		this.$binds.push(paires);
		this.visible = true;
		return $q.when(this.getTemplate(), function(template) {
			var rootScope = cmp.rootScope || $rootScope;
			var $scope = rootScope.$new(false);
			var $element = locals.$element;
			var $ctrl;
			var controllerDef;

			$element.html(template);
			var link = $compile($element);
			locals.$scope = $scope;
			if ((controllerDef = cmp.controller)) {
				$ctrl = $controller(controllerDef, locals);
				if ((cmp.controllerAs)) {
					$scope[cpm.controllerAs] = $ctrl;
				}
				$element.data('$ngControllerController', $ctrl);
			}
			$scope[cmp.resolveAs || '$resolve'] = locals;
			link($scope);
			_.assign(paires, locals, {
				$controller: $ctrl
			});
		});
	}


	/**
	Destroy all visible parts and free all resources
	
	@memberof MbComponent
	 */
	MbComponent.prototype.destroy = function() {
		var $bind = this.$binds;
		this.$binds = [];
		_.forEach($bind, function(pair) {
			if (pair.$scope) {
				pair.$scope.$destroy();
				pair.$scope = undefined;
			}
			if (pair.$element) {
				pair.$element.remove();
				pair.$element = undefined;
			}
			pair.$controller = undefined;
		})
	};

	return MbComponent;
});
