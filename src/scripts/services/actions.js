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
@name $mbActions
@description Manage application actions

Controllers and views can access actions which is registered by an
applications. This service is responsible to manage global actions.

Note: if an action added at the configuration then there is no event.

 */
angular.module('mblowfish-core').provider('$mbActions', function() {


	/*
	All required services to do actions
	*/
	var dispatcher;
	var Action;
	var q;

	/*
	All storage and variables
	*/
	var configs = {
		items: {}
	};
	var actions = {};
	var groups = {};

	function addAction(commandId, action) {
		if (!(action instanceof Action)) {
			action = new Action(action);
		}
		actions[commandId] = action;
		action.id = commandId;
		return service;
	}

	function removeAction(commandId, action) {
		delete actions[commandId];
		return service;
	}

	function getAction(commandId) {
		return actions[commandId];
	}

	function getActions() {
		return actions;
	};

	function addGroup(groupId, groupConfigs) { }
	function removeGroup(groupId) { }
	function getGroup(groupId) { }
	function getGroups() { }


	function exec(actionId, $event) {
		$event = $event || {
			stopPropagation: function() { },
			preventDefault: function() { },
		}; // TODO: amso, 2020: crate an action event
		var action = this.getAction(actionId);
		if (!action) {
			// TODO: maso, 2020: add an alert system to manage all errors and notifications
			alert('Action \'' + actionId + '\' not found!');
			return q.reject();
		}
		// TODO: maso, 2020: run action inside the actions service
		return action.exec($event);
	};

	function loadActions() {
		// Load actions
		var items = configs.items || {};
		_.forEach(items, function(config, id) {
			var action = new Action(config);
			addAction(id, action);
		});
	}


	/* @ngInject */
	var service = function(
        /* angularjs */ $window,
        /* mb        */ $mbDispatcher, MbAction, $q) {
		dispatcher = $mbDispatcher;
		window = $window;
		q = $q;
		Action = MbAction;

		loadActions();

		this.addAction = addAction;
		this.removeAction = removeAction;
		this.getAction = getAction;
		this.getActions = getActions;
		this.exec = exec;

		this.addGroup = addGroup;
		this.removeGroup = removeGroup;
		this.getGroup = getGroup;
		this.getGroups = getGroups;

		// Legacy
		newAction = addAction;


		return this;
	};

	var provider = {
		$get: service,
		init: function(actionsConfig) {
			if (configs) {
				// TODO: 2020: merge actions
				actionsConfig.items = _.merge(configs.items, actionsConfig.items);
			}
			configs = actionsConfig;
			return provider;
		},
		addAction: function(actionId, actionConfig) {
			configs.items[actionId] = actionConfig;
			return provider;
		}
	};
	return provider;

});
