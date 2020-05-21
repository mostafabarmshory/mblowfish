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

	//	this.actionsList = [];
	//	this.actionsMap = {};
	//
	//	this.groupsList = [];
	//	this.groupsMap = [];
	//
	//	this.actions = function() {
	//		return {
	//			'items': this.actionsList
	//		};
	//	}
	//
	//	// TODO: maso, 2018: add document
	//	this.newAction = function(data) {
	//		// Add new action
	//		var action = new Action(data);
	//		// remove old one
	//		var oldaction = this.action(action.id);
	//		if (oldaction) {
	//			this.removeAction(oldaction);
	//		}
	//		// add new one
	//		this.actionsMap[action.id] = action;
	//		this.actionsList.push(action);
	//		if (action.scope) {
	//			var service = this;
	//			action.scope.$on('$destroy', function() {
	//				service.removeAction(action);
	//			});
	//		}
	//		this.updateAddByItem(action);
	//		this.fire('actionsChanged', {
	//			value: action,
	//			oldValue: oldaction
	//		});
	//		return action;
	//	};
	//
	//    /**
	//     * gets action with id
	//     */
	//	this.getAction = function(actionId) {
	//		var action = this.actionsMap[actionId];
	//		if (action) {
	//			return action;
	//		}
	//	};
	//
	//	// TODO: maso, 2018: add document
	//	this.action = this.getAction;
	//
	//	// TODO: maso, 2018: add document
	//	this.removeAction = function(action) {
	//		this.actionsMap[action.id] = null;
	//		var index = this.actionsList.indexOf(action);
	//		if (index > -1) {
	//			this.actionsList.splice(index, 1);
	//			this.updateRemoveByItem(action);
	//			this.fire('actionsChanged', {
	//				value: undefined,
	//				oldValue: action
	//			});
	//			return action;
	//		}
	//	};
	//
	//	// TODO: maso, 2018: add document
	//	this.groups = function() {
	//		return {
	//			'items': this.groupsList
	//		};
	//	};
	//
	//	// TODO: maso, 2018: add document
	//	this.newGroup = function(groupData) {
	//		// TODO: maso, 2018: assert id
	//		return this.group(groupData.id, groupData);
	//	};
	//
	//	// TODO: maso, 2018: add document
	//	this.group = function(groupId, groupData) {
	//		var group = this.groupsMap[groupId];
	//		if (!group) {
	//			group = new ActionGroup(groupData);
	//			group.id = groupId;
	//			// TODO: maso, 2019: just use group map and remove groupList
	//			this.groupsMap[group.id] = group;
	//			this.groupsList.push(group);
	//			this.updateAddByItem(group);
	//		} else if (groupData) {
	//			angular.extend(group, groupData);
	//		}
	//		this.fire('groupsChanged', {
	//			value: group
	//		});
	//		return group;
	//	};
	//
	//	this.updateAddByItem = function(item) {
	//		var groups = item.groups || [];
	//		for (var i = 0; i < groups.length; i++) {
	//			var group = this.group(groups[i]);
	//			group.addItem(item);
	//		}
	//	};
	//
	//	this.updateRemoveByItem = function(item) {
	//		var groups = item.groups || [];
	//		for (var i = 0; i < groups.length; i++) {
	//			var group = this.group(groups[i]);
	//			group.removeItem(item);
	//		}
	//	};

	/*
	All required services to do actions
	*/
	var dispatcher;
	var Action;

	/*
	All storage and variables
	*/
	var configs = {};
	var actions = {};
	var groups = {};

	function addAction(commandId, action) {
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
			$window.alert('Action \'' + actionId + '\' not found!');
			return;
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
        /* mb        */ $mbDispatcher, MbAction) {
		dispatcher = $mbDispatcher;
		window = $window;
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
			configs = actionsConfig;
			return provider;
		}
	};
	return provider;

});
