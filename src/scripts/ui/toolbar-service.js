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
@ngdoc Services
@name $mbToolbarProvider
@description Initialize the toolbar service

The main goole is to set default main toolbar layout.

You may enable dynamic toolbar.

*/
/**
@ngdoc Services
@name $mbToolbar
@description Manages list of toolbars.

You can register a toolbar with an url. For example

	/demo/view/test

All icons will be managed
 */
angular.module('mblowfish-core').provider('$mbToolbar', function() {
	// TODO: load toolbar config from local storage

	/* Type and srvices */
	var Toolbar;

	/* variables */
	var mainToolbarConfig = [];
	var toolbars = {};


	function addToolbar(toolbarId, toolbar) {
		toolbars[toolbarId] = toolbar;
		return toolbar;
	}

	function removeToolbar(toolbarId) {
		var toolbar = toolbars[toolbarId];
		if (toolbar) {
			toolbar.destroy();
		}
		delete toolbars[toolbarId];
	}


	function getToolbar(toolbarId) {
		var toolbar = toolbars[toolbarId];
		return toolbar;
	}

	function loadDefaultToolbars() {
		_.forEach(mainToolbarConfig, function(toolbarConfig) {
			var toolbar = new Toolbar(toolbarConfig);
			addToolbar(toolbarConfig.id, toolbar);
		});
	}
	
	function addToolbarGroup(toolbarGroupId, toolbarGroup){
		// TODO:
	}

	
	function getToolbarGroup(toolbarGroupId){
		// TODO:
	}
	
	function removeToolbarGroup(toolbarGroupId){
		// TODO:
	}

	/** 
	Initialize the default toolbar layout.
	
	@memberof $mbToolbarProvider
	*/
	function init(config) {
		mainToolbarConfig = config || [];
	}

	return {
		/* @ngInject */
		$get: function(MbToolbar) {
			Toolbar = MbToolbar;

			loadDefaultToolbars();

			// To manage toolbars ()
			this.getToolbar = getToolbar;
			this.addToolbar = addToolbar;
			this.removeToolbar = removeToolbar;
			
			// To manage toolbars group
			this.addToolbarGroup = addToolbarGroup;
			this.getToolbarGroup = getToolbarGroup;
			this.removeToolbarGroup = removeToolbarGroup;

			return this;
		},
		init: init
	};
});
