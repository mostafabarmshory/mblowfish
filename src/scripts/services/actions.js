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
mblowfish.provider('$mbActions', function() {


	/*
	All required services to do actions
	*/
	var
		q,
		Action,
		service,
		provider;

	/*
	All storage and variables
	*/
	var
		configs = {
			items: {}
		},
		actions = {};

	function addAction(actionId, action) {
		if (!(action instanceof Action)) {
			action = new Action(action);
		}
		actions[actionId] = action;
		action.id = actionId;
		mbComponent.addComponent(actionId, action);
		return service;
	}

	function removeAction(acctionId) {
		mbComponent.removeComponent(actionId);
		delete actions[acctionId];
		return service;
	}

	function getAction(actionId) {
		return actions[actionId];
	}

	function getActions() {
		return actions;
	};


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


	service = {
		addAction: addAction,
		removeAction: removeAction,
		getAction: getAction,
		getActions: getActions,
		exec: exec,
	};

	provider = {
		/* @ngInject */
		$get: function(
        /* angularjs */ $window,
        /* mb        */ $mbDispatcher, $mbComponent, MbAction, $q) {
			dispatcher = $mbDispatcher;
			mbComponent = $mbComponent;
			window = $window;
			q = $q;
			Action = MbAction;

			loadActions();

			return service;
		},
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
