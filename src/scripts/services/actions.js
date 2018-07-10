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
 * Controllers and views can access actions which is registered by an applications. This 
 * service is responsible to manage global actions.
 * 
 */
.service('$actions', function(Action, ActionGroup) {
	var _actionsList = [];
	var _actionsMap = {};
	
	var _groupsList = [];
	var _groupsMap = [];

	function _actions() {
		return {
			'items' : _actionsList
		};
	}
	
	// TODO: maso, 2018: add document
	function _newAction(data){
		// Add new action
		var action = new Action(data);
		_actionsMap[action.id] = action;
		_actionsList.push(action);
    	for(var i = 0; i < action.groups.length; i++){
    		var group = _group(action.groups[i]);
    		group.items.push(action);
    	}
    	if(action.scope){
    		action.scope.$on("$destroy", function() {
    	        _removeAction(action);
    	    });
    	}
		return action;
	}
	
	// TODO: maso, 2018: add document
	function _action(actionId){
		var action = _actionsMap[actionId];
		if(action){
			return action;
		}
	}
	
	// TODO: maso, 2018: add document
	function _removeAction(action){
		_actionsMap[action.id] = null;
		var index = _actionsList.indexOf(action);
	    if (index > -1) {
	    	_actionsList.splice(index, 1);
	    	for(var i = 0; i < action.groups.length; i++){
	    		var group = _group(action.groups[i]);
	    		var j = group.items.indexOf(action);
	    		if(j > -1){
	    			group.items.splice(j, 1);
	    		}
	    	}
	    	return action;
	    }
	}
	
	// TODO: maso, 2018: add document
	function _groups(){
		return {
			'items' : _groupsList
		};
	}
	
	// TODO: maso, 2018: add document
	function _newGroup(groupData){
		// TODO: maso, 2018: assert id
		return _group(groupData.id, groupData);
	}
	
	// TODO: maso, 2018: add document
	function _group(groupId, groupData){
		var group = _groupsMap[groupId];
		if(!group){
			group = new ActionGroup();
			group.id = groupId;
			_groupsMap[group.id] = group;
			_groupsList.push(group);
		}
		if(groupData){
			angular.extend(group, groupData);
		}
		return group;
	}
	
	
	return {
			// actions
			actions : _actions,
			newAction: _newAction,
			action: _action,
			removeAction: _removeAction,
			
			// groups
			groups: _groups,
			newGroup: _newGroup,
			group: _group,
	};
});
