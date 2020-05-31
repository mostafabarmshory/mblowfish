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
@ngdoc Services
@name $mbEditor
@description Manages editors

/**
@ngdoc Serivces
@name $mbView
@description Manages list of views 

Editor is a multiple instance page whit a unique  path in the system. There is one ore more
variable. However original path is unique to each editor.

Path parameters are not writable by editor controller.

It is possiblet to create (or register an editor) with parametirzed path. If there is no variable
part in the path, this is not an editor.

There may be some additional parameters which is send to an editor by 
query parameters. Note that, path parameter is more important than query parameters.

Here is list of services related to an specific editor:

- $params: list of param from query and path
- $editor: related editor controller from layout system
- $element: HTML view
- $scope: data scope of the editor

These are injectable to an editor contrller.

 */
angular.module('mblowfish-core').provider('$mbEditor', function() {
	/***********************************************************************************
	 * Utility
	 ***********************************************************************************/
	var inherit;// = $mbUiUtil.inherit;
	var switchRouteMatcher; // = $mbUiUtil.switchRouteMatcher;

	var editorConfigs = {};
	var editors = {};

	//	var editorsRootScope;
	var rootScope;
	var mbRoute;
	var Editor;

	var service;
	var provider;


	/**
	Adds new editor descritpion
	
	@name registerEditor	
	@memberof $mbEditor
	 */
	function registerEditor(name, editorConfig) {
		var config = _.assign({
			isEditor: true,
			reloadOnSearch: false,
			reloadOnUrl: true,
			componentState: {
				originalUrl: name,
			}
		}, editorConfig)
		editorConfigs[name] = config;
		// Add to routes
		mbRoute.when(name, config);
		config.route = mbRoute.getRoutes(name);
		// TODO: Add toolbar
		// TODO: Add menu
		return service;
	}

	/**
	Removes editor description from system
	
	@name registerEditor	
	@memberof $mbEditor
	 */
	function unregisterEditor(name) {
		// TODO: remove toolbar
		// TODO: remove menu
		delete editorConfigs[name];
		return service;
	}

	function getEditorConfigMatch(url, inputParams) {
		// Match a route
		var params;
		var match;
		_.forEach(editorConfigs, function(editorConfig, name) {
			if (!match && (params = switchRouteMatcher(url, editorConfig.route))) {
				route = _.assign({}, editorConfig.route, {
					params: angular.extend({}, inputParams, params),
					pathParams: params
				});
				match = _.assign({}, editorConfig, {
					url: url,
					name: name,
					$route: route
				});
			}
		});
		return match;
	}


	/**
	Find and return existed editor
	
	@name getEditor	
	@memberof $mbEditor
	 */
	function getEditor(name) {
		return editors[name];
	}


	/**
	Check if the editor exist
	
	@name has	
	@memberof $mbEditor
	 */
	function hasEditor(name) {
		var editor = getEditor(name);
		return !_.isUndefined(editor);
	}
	
	/**
	Opens a new editor
	
	To open a new editor, name (unique path of the view) is required. As you know, editors
	are registered with a dynamic path (e.g. /users/:userId) but you must open a new editor
	with static path (e.g. /users/1).
	
	@memberof $mbEditor
	 */
	function fetch(name, state) {
		// 0- check if editor is open
		var editor = editors[name];
		if (editor) {
			return editor;
		}

		// 1- Get editor configuration
		var editorConfig = getEditorConfigMatch(name, state);
		if (_.isUndefined(editorConfig)) {
			// XXX: maso, 2020: View not found throw error
			return;
		}

		// 3- Creat new editor
		return editors[name] = new Editor(editorConfig)
			.setAnchor('editors')
			.setState(state);
	}

	/**
	Opens a new editor
	
	To open a new editor, name (unique path of the view) is required. As you know, editors
	are registered with a dynamic path (e.g. /users/:userId) but you must open a new editor
	with static path (e.g. /users/1).
	
	@memberof $mbEditor
	 */
	function open(name, state) {
		return fetch(name, state)
			.setVisible(true);
	}

	//	function getScope() {
	//		return editorsRootScope;
	//	}

	provider = {
		$get: function(
			/* AngularJS */ $rootScope,
			/* Mblowfish */ $mbUiUtil, $mbRoute, MbEditor) {
			inherit = $mbUiUtil.inherit;
			switchRouteMatcher = $mbUiUtil.switchRouteMatcher;

			// Services
			rootScope = $rootScope;
			mbRoute = $mbRoute;
			Editor = MbEditor;

			// Editor description
			this.registerEditor = registerEditor;
			this.unregisterEditor = unregisterEditor;

			// MbEditor
			this.open = open;
			this.fetch = fetch;
			this.has = hasEditor;
			this.getEditor = getEditor;

			service = this;
			return this;
		}
	};
	return provider;
});
