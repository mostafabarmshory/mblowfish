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

angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $wbFloat
 * @description Open and manage float panels
 * 
 * 
 * The base of this implementation is https://jspanel.de/api.html
 */
.service('$wbFloat', function($q, $wbUtil, $rootScope, $compile, $controller) {
	

	/**
	 * @ngdoc Factory
	 * @name InternalDialog
	 * @description The internal dialog
	 * 
	 * Manage an internal dialog
	 */
	function InternalDialog(optionsOrPreset){
		this.setUserOptions(optionsOrPreset);
		var dialog = this;
		this.callback = function() {
			var element = angular.element(this.content);
			dialog.setElement(element);
		};
		this.onclosed = function(){
			/*
			 * Remove scope
			 * 
			 * NOTE: if there is a $watch, then this return an error
			 */
			if(dialog.scope){
				dialog.scope.$destroy();
				delete dialog.scope;
			}
		};
	}

	InternalDialog.prototype.setUserOptions = function(optionsOrPreset) {
		this._userOptions = optionsOrPreset;
		this.theme = 'primary';

		this.closeOnEscape =  optionsOrPreset.closeOnEscape;

		this.header = optionsOrPreset.header;
		this.headerTitle = optionsOrPreset.headerTitle || 'my panel #1';
		this.headerControls = optionsOrPreset.headerControls || 'all';

		this.position = optionsOrPreset.position || 'center-top 0 0';
		this.panelSize = optionsOrPreset.panelSize || '400 400';
		this.contentSize = optionsOrPreset.contentSize || '450 250';
	};

	InternalDialog.prototype.getUserOptions = function() {
		return this._userOptions;
	};

	InternalDialog.prototype.setRootElement = function(element){
		this._rootElement = element;
		element.css('visibility', this._isVisible ? 'visible' : 'hidden');
	};

	InternalDialog.prototype.getRootElement = function(){
		return this._rootElement;
	};

	InternalDialog.prototype.setElement = function(element){
		this._element = element;
		if(this._element){
			if(this._elementPromise){
				this._elementPromise.resolve(element);
			}
		}
	};

	InternalDialog.prototype.getElement = function(){
		if(!this._element){
			if(!this._elementPromise){
				this._elementPromise = $q.defer();
			}
			return this._elementPromise.promise;
		}
		return $q.when(this._element);
	};

	InternalDialog.prototype.setScope = function(scope){
		this._scope = scope;
	};

	InternalDialog.prototype.getScope = function(){
		return this._scope;
	};

	InternalDialog.prototype.setVisible = function(flag){
		this._isVisible = flag;
		var element = this.getRootElement();
		if(element){
			element.css('visibility', this._isVisible ? 'visible' : 'hidden');
		}
	};
	
	InternalDialog.prototype.hide = function(){
		this.setVisible(false);
	};

	InternalDialog.prototype.isVisible = function(){
		return this._isVisible;
	};
	
	InternalDialog.prototype.setPanel = function(panel){
		this._panel = panel;
	};
	
	InternalDialog.prototype.getPanel = function(){
		return this._panel;
	};
	
	/**
	 * Changes size of the panel
	 * 
	 * @memberof InternalDialog
	 * @params w {String|Integer} the width of the panel
	 * @params h {String|Integer} the height of the panel
	 */
	InternalDialog.prototype.resize = function(w, h){
		var panel = this.getPanel();
		panel.resize({
			width: w,
			height: h
		});
	};
	
	InternalDialog.prototype.setView = function(optionsOrPreset){
		var dialog = this;
		var contentElement = null;
		var template = null;
		/*
		 * Create view
		 */
		function createView() {
			// TODO: maso, 2018: check contentElement
			// TODO: maso, 2019: check template
			var parenScope = optionsOrPreset.parent || $rootScope;
			var childScope = optionsOrPreset.scope || parenScope.$new(false, parenScope);

			// 3- bind controller
			var element = angular.element(template);
			var link = $compile(element);
			if (angular.isDefined(optionsOrPreset.controller)) {
				var controller = $controller(optionsOrPreset.controller, {
					$scope: childScope,
					$element: element,
					$wbFloat: dialog
				});
				if (optionsOrPreset.controllerAs) {
					childScope[optionsOrPreset.controllerAs] = controller;
				}
				element.data('$ngControllerController', controller);
			}
			link(childScope);

			contentElement.empty();
			contentElement.append(element);
		}

		// 2- create element
		return this.getElement()
		.then(function(element){
			contentElement = element;
			return $wbUtil.getTemplateFor(optionsOrPreset);
		})
		.then(function(templateL){
			template = templateL;
			return createView();
		});
	};
	
	

	/**
	 * Hide an existing float and resolve the promise returned from
	 * $wbFloat.show()
	 * 
	 * @name hide
	 * @memberof $wbFloat
	 * @param response
	 *            An argument for the resolved promise.
	 * @return promise A promise that is resolved when the float has been
	 *         closed.
	 */
	/**
	 * Hide an existing float and reject the promise returned from
	 * $wbFloat.show().
	 * 
	 * @name hide
	 * @memberof $wbFloat
	 * @param response
	 *            An argument for the rejected promise.
	 * @return promise A promise that is resolved when the float has been
	 *         closed.
	 */
	/**
	 * Display an element with a float dialog
	 * 
	 * @name show
	 * @memberof $wbFloat
	 * @param optionsOrPreset
	 *            {object}
	 *            <ul>
	 *            <li>title - {=string}: title of the float</li>
	 *            <li></li>
	 *            <li></li>
	 *            
	 *            
	 *            <li>templateUrl - {string=}: The URL of a template that will
	 *            be used as the content of the dialog.</li>
	 *            <li>template- {string=}: HTML template to show in the dialog.
	 *            This must be trusted HTML with respect to Angular's $sce
	 *            service. This template should never be constructed with any
	 *            kind of user input or user data.</li>
	 *            <li>contentElement:</li>
	 *            <li>scope - {object=}: the scope to link the template
	 *            controller to. If none is specified, it will create a new
	 *            isolate scope. This scope will be destroyed when the dialog is
	 *            removed unless preserveScope is set to true.</li>
	 *            <li>controller - {function|string=}: The controller to
	 *            associate with the dialog. The controller will be injected
	 *            with the local $mdDialog, which passes along a scope for the
	 *            dialog.</li>
	 *            <li>controllerAs - {string=}: An alias to assign the
	 *            controller to on the scope.</li>
	 *            <li>parent - {element=}: The element to append the dialog to.
	 *            Defaults to appending to the root element of the application.</li>
	 *            </ul>
	 * @return promise A promise that can be resolved with $mdFloat.hide() or
	 *         rejected with $mdFloat.cancel().
	 */
	this.show = function(optionsOrPreset) {
		return $q.resolve(this.create(optionsOrPreset))
		.then(function(dialog){
			dialog.setView(optionsOrPreset);
			return dialog;
		});
	};

	/**
	 * Creates and return a dialog
	 * 
	 * @memberof $wbFloat
	 */
	this.create = function(optionsOrPreset) {
		var dialog = new InternalDialog(optionsOrPreset);
		var panel = jsPanel.create(dialog);
		dialog.setPanel(panel);
		dialog.setRootElement(angular.element(panel));
		return dialog;
	};
});
