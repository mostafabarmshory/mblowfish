/*
 * angular-material-icons v0.7.1
 * (c) 2014 Klar Systems
 * License: MIT
 */

/**
 * @ngdoc Services
 * @name $mbToolbar
 * @description Manage icons to use in the view
 * 
 *  All icons will be managed
 */
angular.module('mblowfish-core').service('$mbToolbar', function() {
	
	var toolbars = [];

	this.add = function(name, toolbar) {
		toolbars[name] = toolbar;
		return toolbar;
	}

	this.get = function(name) {
		return toolbars[name] || toolbars['default'];
	}

	this.list = function() {
		return toolbars;
	}

	return this;
});
