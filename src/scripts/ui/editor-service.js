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
 * @name $mbEditor
 * @description A page management service
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
