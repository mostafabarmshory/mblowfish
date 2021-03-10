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
@name MbContainer
@description A basic UI Component wich is used to build views, editor, and tooblars.
@public
@type {Object}

It 

@property {string}  url          - An alias fo the id
@property {boolean} isEditor     - A falg used for editors (special types of ui Components)
@property {boolean} isView       - A flag used for views (special types of UI components)
@property {boolean} isToolbar    - Is a toolbar
@property {boolean} isMenu       - Is a menu
@property {string}  title        - Title of the UI component
@property {string}  description  - A brife description of the UI component.
@property {string}  icon         - An Icon to display for the component
@property {string}  template     - A HTML text used as a UI for the component
@property {string}  templateUrl  - A URL of HTML resources to use as UI of the component
@property {string}  controller   - Name of a controller to used with UI
@property {string}  controllerAs - Alias of the controller in the UI


UI component is the basic of the whoule view. All part wil be registerd as a UI component such as a menu, toolbar,
view, or an editor.


@ngInject
 */
function MbContainerFactory(
	/* Angularjs */ $rootScope, $compile, $controller, $q,
	/* Mblowfish */ $mbUiUtil, MbUiHandler, $mbTheming, MbObservableObject) {

	/*
	Create new instance of a UI component. It may used as view, editor
	or other part of UI.
	
	@memberof MbContainer
	@constructor
	@param {object} configs - A configuration set to crate a new instance
	*/
	function MbContainer(configs) {
		MbObservableObject.call(this);
		_.assignIn(this, {
			// global attributes
			url: undefined,
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
		}, configs);

		// $element, $controller, $scope pairs
		this.$handler = undefined;
		return this;
	};

	MbContainer.prototype = Object.create(MbObservableObject.prototype);

	/**
	Gets template of the component
	
	Template is a HTML text which is used to build a view of the component.
	
	@returns {promisse} To resolve the template value
	@memberof MbContainer
	 */
	MbContainer.prototype.getTemplate = function() {
		return $q.when(this.template || $mbUiUtil.getTemplateFor(this));
	}


	/**
	Checks if the component is visible anywhare
	
	A component is visible if there is a paire of MVC item. For example an action is visible if
	it is created and append to the view by MVC elements.
	
	@returns {boolean} True if the component is visible.
	@memberof MbContainer
	 */
	MbContainer.prototype.isVisible = function() {
		return !_.isUndefined(this.$handler);
	}


	/**
	Renders the container and return its handler
	
	@memberof MbContainer
	 */
	MbContainer.prototype.render = function(locals) {
		var cmp = this;
		this.$handler = true;
		// If there is no root element, then we create a new one
		if (_.isUndefined(locals.$element)) {
			locals.$element = angular.element('<div></div>');
		}

		// If there is no root element, then we create a new one
		if (_.isUndefined(locals.$scope)) {
			locals.$scope = $rootScope.$new(false);
		}
		return $q.when(this.getTemplate(), function(template) {
			var $scope = locals.$scope
			var $element = locals.$element;
			var $ctrl;
			var controllerDef;

			$element.html(template);
			var link = $compile($element);
			if ((controllerDef = cmp.controller)) {
				$ctrl = $controller(controllerDef, locals);
				$scope[cmp.controllerAs || 'ctrl'] = $ctrl;
				$element.data('$ngControllerController', $ctrl);
			}
			$scope[cmp.resolveAs || '$resolve'] = locals;
			link($scope);
			// controller function required fro theming
			// TODO: these parts are removed from new current angularjs but required in angular material
			if (_.isUndefined($element.controller)) {
				$element.controller = function() { };
			}
			if (_.isUndefined($element.scope)) {
				$element.scope = function() {
					return $scope;
				};
			}
			$mbTheming($element);

			cmp.$handler = new MbUiHandler(_.assign(locals, {
				$scope: $scope,
				$element: $element,
				$controller: $ctrl
			}));
			return cmp.$handler;
		});
	}


	/**
	Destroy all visible parts and free all resources
	
	@memberof MbContainer
	 */
	MbContainer.prototype.destroy = function() {
		if (_.isUndefined(this.$handler)) {
			return;
		}
		this.$handler.destroy();
		delete this.$handler;
	};

	/**
	Sets title fo the frame.
	
	The title is displate on the top of each frame. It can be changed dynamically.
	
	@see #getTitle
	 */
	MbContainer.prototype.setTitle = function(title) {
		this.title = title;
		if (!this.$handler || !this.$handler.$dockerContainer) {
			return;
		}
		// TODO: maso, 2020: the layout syste must detect the changes and update the
		// visual aspects
		this.$handler.$dockerContainer.setTitle(title);
		return this;
	};

	/**
	Gets current title of the frame
	 */
	MbContainer.prototype.getTitle = function() {
		return this.title;
	};

	return MbContainer;
}

export default MbContainerFactory;
