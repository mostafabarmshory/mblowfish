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
function mbToolbar() {
	
	//-----------------------------------------------------------------------------------
	// Type and service
	//-----------------------------------------------------------------------------------
	var Toolbar;

	//-----------------------------------------------------------------------------------
	// Variables
	//-----------------------------------------------------------------------------------
	var mainToolbarConfig = [];
	var toolbars = {};
	var toolbarGroups = {};
	var toolbarGroupsConfig = {};


	//-----------------------------------------------------------------------------------
	// Functions
	// TODO: load toolbar config from local storage
	//-----------------------------------------------------------------------------------
	function addToolbar(toolbarId, toolbar) {
		if (!(toolbar instanceof Toolbar)) {
			toolbar = new Toolbar(_.assign(toolbar, {
				url: toolbarId
			}));
		}
		if(toolbars[toolbarId]){
			// TODO: merge old toolbar with new one
			// toolbar.merge(toolbars[toolbarId]);
			var items = toolbars[toolbarId].items;
			var titems = toolbar.items;
			toolbar = _.assign(toolbar, toolbars[toolbarId]);
			toolbar.items = _.concat(items, titems);
		}
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
		if(!toolbar){
			return addToolbar(toolbarId, {});
		}
		return toolbar;
	}

	function loadDefaultToolbars() {
		_.forEach(mainToolbarConfig, function(toolbarConfig) {
			var toolbar = new Toolbar(toolbarConfig);
			addToolbar(toolbarConfig.url, toolbar);
		});
	}

	function addToolbarGroup(toolbarGroupId, toolbarGroup) {
		// TODO: maso, 2020: support lazy load of a toolbar
		toolbarGroups[toolbarGroupId] = toolbarGroup;
		var toolbarGroupConfig = toolbarGroupsConfig[toolbarGroupId];
		if (toolbarGroupConfig) {
			_.forEach(toolbarGroupConfig, function(toolbar) {
				toolbarGroup.addToolbar(toolbar);
			});
		}
	}


	function getToolbarGroup(toolbarGroupId) {
		if (_.isUndefined(toolbarGroupId)) {
			toolbarGroupId = '/app/main'
		}
		// TODO: maso,2020: support lazy load of toolbar groups
		var toolbarGroup = toolbarGroups[toolbarGroupId];
		var toolbarGroupConfig = toolbarGroupsConfig[toolbarGroupId];
		if (_.isUndefined(toolbarGroupConfig)) {
			toolbarGroupsConfig[toolbarGroupId] = toolbarGroupConfig = [];
		}
		var wrapper = {
			addToolbar: function(toolbar) {
				toolbarGroupConfig.push(toolbar);
				if (toolbarGroup) {
					toolbarGroup.addToolbar(toolbar);
				}
				return this;
			},
			removeToolbar: function(toolbar) {
				const index = toolbarGroupConfig.indexOf(toolbar);
				if (index > -1) {
					toolbarGroupConfig.splice(index, 1);
				}
				if (toolbarGroup) {
					toolbarGroup.removeToolbar(toolbar);
				}
				return this;
			},
			destroty: function() {
				toolbarGroupsConfig[toolbarGroupId] = [];
				toolbarGroupConfig = toolbarGroupsConfig[toolbarGroupId];
				if (toolbarGroup) {
					toolbarGroup.destroy();
				}
			}
		};
		return wrapper;
	}

	function removeToolbarGroup(toolbarGroupId) {
		// TODO:
	}

	/** 
	Initialize the default toolbar layout.
	
	@memberof $mbToolbarProvider
	*/
	function init(config) {
		mainToolbarConfig = config || [];
	}

	//-----------------------------------------------------------------------------------
	// End
	//-----------------------------------------------------------------------------------
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
}

export default mbToolbar;
