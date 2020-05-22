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
@name $mbView
@description Manages list of views 

View is a singletone page whit a unique path in the system. 

It is not possiblet to create (or register a view) with parametirzed path.

There may be some additional parameters for a view which is send to the view by 
query parameters.

Here is list of services related to an specific view:

- $params: list of param from query
- $view: related view controller (controll the view in layout system)
- $element: HTML view
- $scope: data scope of the view

These are injectable to view contrller.

Note: A Toolbar with the same path will be registerd for a view.

Note: A Menu with the same path will be registerd fro a view.


 */
angular.module('mblowfish-core').service('$mbView', function(
	/* AngularJS */ $rootScope,
	/* Mblowfish */ $mbRoute, MbView) {

	var views = {};
	var viewsRootScope = $rootScope.$new(false);

	this.add = function(name, viewConfig) {
		var config = _.assign({
			id: name,
			url: name,
			rootScope: viewsRootScope,
			isView: true,
		}, viewConfig)
		// create view
		var view = new MbView(config);
		views[name] = view;
		// Add to routes
		$mbRoute.when(name, config);
		// TODO: Add toolbar
		// TODO: Add menu

		return this;
	};

	this.get = function(name) {
		return views[name];
	};

	this.has = function(name) {
		var view = this.get(name);
		return !_.isUndefined(view);
	};

	this.open = function(name, where) {
		var view = this.get(name);
		if (_.isUndefined(view)) {
			// TODO: maso, 2020: View not found throw error
			return;
		}
		if (where) {
			view.setAnchor(where);
		}
		view.setVisible(true);
	};

	this.getViews = function() {
		return views;
	};

	this.getScope = function() {
		return viewsRootScope;
	}

	return this;
});
