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
'use strict';
angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $actions
 * @description Manage application actions
 * 
 * Controllers and views can access actions which is registered by an
 * applications. This service is responsible to manage global actions.
 * 
 */
.service('$actions', function(
		/* angularjs */ $window,
		/* mb        */ Action, ActionGroup, MbObservableObject) {

	// extend from observable object
	angular.extend(this, MbObservableObject.prototype);
	MbObservableObject.apply(this);

	this.actionsList = [];
	this.actionsMap = {};

	this.groupsList = [];
	this.groupsMap = [];

	this.actions = function () {
		return {
			'items' : this.actionsList
		};
	}

	// TODO: maso, 2018: add document
	this.newAction = function (data) {
		// Add new action
		var action = new Action(data);
		// remove old one
		var oldaction = this.action(action.id);
		if(oldaction){
			this.removeAction(oldaction);
		}
		// add new one
		this.actionsMap[action.id] = action;
		this.actionsList.push(action);
		if (action.scope) {
			var service = this;
			action.scope.$on('$destroy', function() {
				service.removeAction(action);
			});
		}
		this.updateAddByItem(action);
		this.fire('actionsChanged', {
			value: action,
			oldValue: oldaction
		});
		return action;
	};
	
	/**
	 * gets action with id
	 */
	this.getAction = function (actionId) {
		var action = this.actionsMap[actionId];
		if (action) {
			return action;
		}
	};

	// TODO: maso, 2018: add document
	this.action = this.getAction;

	// TODO: maso, 2018: add document
	this.removeAction = function (action) {
		this.actionsMap[action.id] = null;
		var index = this.actionsList.indexOf(action);
		if (index > -1) {
			this.actionsList.splice(index, 1);
			this.updateRemoveByItem(action);
			this.fire('actionsChanged', {
				value: undefined,
				oldValue: action
			});
			return action;
		}
	};

	// TODO: maso, 2018: add document
	this.groups = function() {
		return {
			'items' : this.groupsList
		};
	};

	// TODO: maso, 2018: add document
	this.newGroup = function(groupData) {
		// TODO: maso, 2018: assert id
		return this.group(groupData.id, groupData);
	};

	// TODO: maso, 2018: add document
	this.group = function (groupId, groupData) {
		var group = this.groupsMap[groupId];
		if (!group) {
			group = new ActionGroup(groupData);
			group.id = groupId;
			// TODO: maso, 2019: just use group map and remove groupList
			this.groupsMap[group.id] = group;
			this.groupsList.push(group);
			this.updateAddByItem(group);
		}else if (groupData) {
			angular.extend(group, groupData);
		}
		this.fire('groupsChanged', {
			value: group
		});
		return group;
	};
	
	this.updateAddByItem = function(item){
		var groups = item.groups || [];
		for (var i = 0; i < groups.length; i++) {
			var group = this.group(groups[i]);
			group.addItem(item);
		}
	};
	
	this.updateRemoveByItem = function(item){
		var groups = item.groups || [];
		for (var i = 0; i < groups.length; i++) {
			var group = this.group(groups[i]);
			group.removeItem(item);
		}
	};
	
	this.exec = function(actionId, $event){
		var action = this.getAction(actionId);
		if(!action){
			$window.alert('Action \''+actionId +'\' not found!');
			return;
		}
		return action.exec($event);
	};

});
