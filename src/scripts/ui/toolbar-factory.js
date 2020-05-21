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
@name MbToolbar
@description A toolbar model

Toolbar display list of ui component on top of a view, editor or the main application.

A unique address is used for each toolbar for example

	/demo/view/test

Default toolbar is '/app/toolbar'.

Toolbar is a UI component.

You can add a toolbar into a toolbar, however, do not add them more than two lever.

 */
angular.module('mblowfish-core').factory('MbToolbar', function(MbContainer, $mbActions, $mbComponent) {

	function MbToolbar(configs) {
		MbContainer.call(this, configs);
		this.actions = [];
		this.actionHandlers = {};
		this.components = [];
		this.componentHandlers = {};
		return this;
	};

	// Circle derives from Shape
	MbToolbar.prototype = Object.create(MbContainer.prototype);
	var supper = MbContainer.prototype;

	MbToolbar.prototype.render = function(locals) {
		var ctrl = this;
		locals.$toolbar = ctrl;
		return supper.render.call(this, locals)
			.then(function() {
				return loadItems(ctrl);
			})
			.then(function() {
				return ctrl.$handler;
			});
	};

	MbToolbar.prototype.addAction = function(action) {
		if (_.isUndefined(this.$handler)) {
			this.actions.push(action);
			return;
		}
		// keep action handler
		var toolbar = this;
		return loadComponent(toolbar, action).then(function(handler) {
			toolbar.actionHandlers[action.id] = handler;
			return handler;
		});
	};

	MbToolbar.prototype.removeAction = function(action) {
		var handler = toolbar.actionHandlers[action.id];
		delete toolbar.actionHandlers[action.id];
		handler.destroy();
	};

	MbToolbar.prototype.addComponent = function(component) {
		// keep action handler
		var toolbar = this;
		return loadComponent(toolbar, component).then(function(handler) {
			toolbar.componentHandlers[component.id] = handler;
			return handler;
		});
	};

	MbToolbar.prototype.removeComponent = function(component) {
		var handler = toolbar.componentHandlers[component.id];
		delete toolbar.componentHandlers[component.id];
		handler.destroy();
	};

	/*
	Loads all toolbar items
	*/
	function loadItems(toolbar) {
		var items = toolbar.items || [];
		_.forEach(items, function(itemId) {
			// get item
			var item = $mbActions.getAction(itemId);
			if (item) {
				toolbar.addAction(item);
				return;
			}
			item = $mbComponent.get(itemId);
			if (item) {
				toolbar.addComponent(item);
				return;
			}
			// TODO: maso, 2020: add log
		});

		// adding dynamci action
		_.forEach(toolbar.actions, function(action) {
			toolbar.addAction(action);
		});
		toolbar.actions = [];
	}


	function loadComponent(toolbar, component) {
		var handler = toolbar.$handler;
		// create place holder
		var element = angular.element('<mb-toolbar-item></mb-toolbar-item>');
		handler.$element.append(element);

		// render the item
		return component.render({
			$toolbar: toolbar,
			$element: element,
			$rootScope: handler.$scope
		});
	}

	return MbToolbar;
});
