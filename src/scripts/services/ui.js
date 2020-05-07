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
 * @ngdoc service
 * @name $ui
 * @description A page management service
 */
angular.module('mblowfish-core').service('$mbUi', function(
		/* angularjs */ $rootScope, $rootElement, $window) {
	var defaultLayout = {
		settings: {
			hasHeaders: true,
			constrainDragToContainer: true,
			reorderEnabled: true,
			selectionEnabled: true,
			popoutWholeStack: false,
			blockedPopoutsThrowError: true,
			closePopoutsOnUnload: true,
			showPopoutIcon: false,
			showMaximiseIcon: true,
			showCloseIcon: true
		},
		dimensions: {
			borderWidth: 5,
			minItemHeight: 16,
			minItemWidth: 50,
			headerHeight: 20,
			dragProxyWidth: 300,
			dragProxyHeight: 200
		},
		content: [{
			type: 'row',
			isClosable: false,
			componentState: {
				url: '/wb/ui/',
			},
			content: [{
				id: 'navigator',
				type: 'component',
				componentName: 'view',
				width: 20,
				componentState: {
					url: '/mb/ui/views/navigator/'
				},
			}, {
				type: 'stack',
				title: 'Editors',
				isClosable: false,
				componentState: {
					url: '/wb/ui/editors/',
				}
			}]
		}]
	};
	var editors;
	var views;

	// ------------------------------------------------------------------
	// Utility function
	//
	//
	// ------------------------------------------------------------------
	this.getLayout = function() {
		var layout = null;
		return defaultLayout || layout;
	};
	this.saveLayout = function() { };
	this.setDefaultLayout = function(layout) {
		defaultLayout = layout;
	};

	this.openEditor = function() { };
	this.getEditor = function() { };
	this.getActiveEditor = function() { };

	this.openView = function() { };
	this.getView = function() { };
	this.getViews = function() { };

	return this;
});
