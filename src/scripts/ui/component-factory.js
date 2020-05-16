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
@description An action item

 */
angular.module('mblowfish-core').factory('MbComponent', function(
	/* Angularjs */ $rootScope, $compile, $controller, $q,
	/* Mblowfish */ $mbUiUtil) {

	/*
	Create new instance of a UI component. It may used as view, editor
	or other part of UI.
	*/
	function MbComponent(configs) {
		_.assignIn(this, {
			// global attributes
			id: undefined,
			url: undefined,
			isEditor: false,
			isView: false,
			title: undefined,
			description: undefined,
			template: undefined,
			templateUrl: undefined,
			controller: undefined,
			controllerAs: undefined,
			// package attributes
			$element: undefined,
			$controller: undefined,
			$scope: undefined,
		}, configs);
		return this;
	};

	MbComponent.prototype.getElement = function() {
		return this.$element;
	};

	MbComponent.prototype.getController = function() {
		return this.$controller;
	};

	MbComponent.prototype.getTemplate = function() {
		return this.template || $mbUiUtil.getTemplateFor(this)
	}

	MbComponent.prototype.isVisible = function() {
		return this.visible;
	}

	MbComponent.prototype.load = function(locals) {
		var cmp = this;
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
			_.assign(cmp, locals, {
				$controller: $ctrl
			});
		});
	}

	MbComponent.prototype.destroy = function() {
		this.visible = false;
		if (this.$scope) {
			this.$scope.$destroy();
			this.$scope = undefined;
		}
		if (this.$element) {
			this.$element.remove();
			this.$element = undefined;
		}
		this.$controller = undefined;
	};

	return MbComponent;
});
