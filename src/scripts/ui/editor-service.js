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
angular.module('mblowfish-core').service('$mbEditor', function(
	/* AngularJS */ $rootScope,
	/* Mblowfish */ $mbRoute, MbEditor) {

	var editorConfigs = [];
	var editorsRootScope = $rootScope.$new(false);
	var editors = [];

	this.add = function(name, editorConfig) {
		var config = _.assign({
			rootScope: editorsRootScope,
			isEditor: true,
			componentState: {
				originalUrl: name,
			}
		}, editorConfig)
		editorConfigs[name] = config;
		// Add to routes
		$mbRoute.when(name, config);
		// TODO: Add toolbar
		// TODO: Add menu
		return this;
	}


	this.get = function(name) {
		return editors[name];
	};

	this.has = function(name) {
		var editor = this.get(name);
		return !_.isUndefined(editor);
	};

	/**
	Opens a new editor
	
	To open a new editor, name (unique path of the view) is required. As you know, editors
	are registered with a dynamic path (e.g. /users/:userId) but you must open a new editor
	with static path (e.g. /users/1).
	
	@memberof $mbEditor
	 */
	this.open = function(name, params) {
		var editor = this.get(name);
		if (_.isUndefined(editor)) {
			// TODO: maso, 2020: View not found throw error
			return;
		}
		editor =
			view.setVisible(true);
	};

	this.getScope = function() {
		return editorsRootScope;
	}

	return this;
});
