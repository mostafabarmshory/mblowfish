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
angular.module('mblowfish-core').provider('$mbView', function() {


	//-----------------------------------------------------------------------------------
	// Service and Factory
	//-----------------------------------------------------------------------------------
	var provider;
	var service;

	var mbRoute;
	var rootScope;
	var View;


	//-----------------------------------------------------------------------------------
	// Variables
	//-----------------------------------------------------------------------------------
	var views = {};
	var viewsConfig = {};
	var viewsRootScope;


	//-----------------------------------------------------------------------------------
	// functions
	//-----------------------------------------------------------------------------------
	function addView(name, viewConfig) {
		var config = _.assign({
			id: name,
			url: name,
			rootScope: viewsRootScope,
			isView: true,
			reloadOnSearch: false,
			reloadOnUrl: true,
		}, viewConfig)
		// create view
		var view = new View(config);
		views[name] = view;
		// Add to routes
		mbRoute.when(name, config);
		// TODO: Add toolbar
		// TODO: Add menu

		return service;
	};

	function getView(name) {
		return views[name];
	};

	function hasView(name) {
		var view = get(name);
		return !_.isUndefined(view);
	};

	/**
	Fetch a View 
	
	If the view is open, then se send focus to it and other parameters will be ignored.
	
	State will be saved by the layout system and used in launch time. It is accessible with $state from the
	view controller. If the controller changes the state then, it will be stored and used in the next time.
	
	The param is reserved in the state and it is forbiden to be canged by the controllers.
	
	Anchore is used for the first time. 
	It may be changed by the user.
	The layout system is responsible to track the location of the view.
	
	@name fetch
	@memberof $mbView
	@param {string} url The name/URL of the view
	@param {Object} state List of key-value to use in view (it is accessable with $state from view controller)
	@param {string} anchor Where the view placed.
	 */
	function fetchView(name, state, anchor) {
		var view = getView(name);
		anchor = anchor || view.anchor;
		if (_.isUndefined(view)) {
			// TODO: maso, 2020: View not found throw error
			return;
		}
		if (view.isVisible()) {
			return view.setFocus();
		}
		return view
			.setAnchor(anchor)
			.setState(state);
	};

	function open(name, state, anchor) {
		return fetchView(name, state, anchor)
			.setVisible(true);
	}

	function getViews() {
		return views;
	};

	function getScope() {
		return viewsRootScope;
	}

	function init() {
		// Load all views
		_.forEach(viewsConfig, function(viewConfig, viewId) {
			addView(viewId, viewConfig);
		})
	}

	//-----------------------------------------------------------------------------------
	// End
	//-----------------------------------------------------------------------------------
	service = {
		add: addView,
		get: getView,
		has: hasView,
		fetch: fetchView,
		open: open,
		getViews: getViews
	};
	provider = {
		/* @ngInject */
		$get: function(
		/* AngularJS */ $rootScope,
		/* Mblowfish */ $mbRoute, MbView) {
			// Service
			rootScope = $rootScope;
			mbRoute = $mbRoute;
			View = MbView;

			init();
			return service;
		},
		addView: function(viewId, viewConfig) {
			viewsConfig[viewId] = viewConfig;
			return provider;
		}
	}
	return provider;
});
