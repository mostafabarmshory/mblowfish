/**
@ngdoc Services
@name $mbActions
@description Manage application actions

Controllers and views can access actions which is registered by an
applications. This service is responsible to manage global actions.

Note: if an action added at the configuration then there is no event.

## Short keys

You may assign a shortkey to each action. When users press a key and the event is not handled by views, editors
or ..., then the action service handls the event.

The short key service is enabled by default. to disable the service:

```javascript
$mbActionsProvider.setShortkeysEnabled(false);
```

 */
mblowfish.provider('$mbActions', function() {


	/*
	All required services to do actions
	*/
	var
		q,
		Action,
		service,
		provider,
		shortkeysEnabled,
		injector,
		location;

	/*
	All storage and variables
	*/
	var
		configs = {
			items: {}
		},
		actions = {},
		actionHotkeyMap;

	function addAction(actionId, action) {
		// update actions liste
		if (!(action instanceof Action)) {
			action = new Action(action);
		}
		actions[actionId] = action;
		action.id = actionId;
		mbComponent.addComponent(actionId, action);

		// Update shortkeys
		actionHotkeyMap.add(action);
		return service;
	}

	function removeAction(acctionId) {
		var action = actions[acctionId];
		if (!action) {
			return service;
		}
		// remove action
		mbComponent.removeComponent(actionId);
		delete actions[acctionId];

		// remove shortkey
		actionHotkeyMap.remove(action);
		return service;
	}

	function getAction(actionId) {
		if (actionId instanceof Action) {
			return actionId;
		} else if (_.isString(actionId)) {
			return actions[actionId];
		}
	}

	function getActions() {
		return actions;
	}

	function exec(actionId, $event) {
		$event = $event || {
			stopPropagation: function() { },
			preventDefault: function() { },
		};
		// run list of actions
		if (_.isArray(actionId)) {
			// XXX: maso, 2020: select an action and run
			return exec(actionId[0], $event);
		}
		// TODO: amso, 2020: crate an action event
		var action = getAction(actionId);
		if (!action) {
			// TODO: maso, 2020: add an alert system to manage all errors and notifications
			alert('Action \'' + actionId + '\' not found!');
			return q.reject();
		}
		// Check if action is alias
		if (action.alias || _.isString(action.actionId)) {
			var actionId = action.actionId || action.alias;
			return exec(actionId, $event);
		}
		// Runs action function
		if (action.action) {
			return q.when(injector.invoke(action.action, this, {
				$event: $event
			}));
		}
		// To support action url
		if (action.url) {
			return location.url(action.url);
		}
		// TODO: maso, 2020: log to show the error
		return q.reject({
			message: 'Action \'' + action.id + '\' is not executable!?'
		});
	};

	/*
	Loads all action
	
	*/
	function loadActions() {
		// Load actions
		var items = configs.items || {};
		_.forEach(items, function(config, id) {
			var action = new Action(config);
			addAction(id, action);
		});
	}

	/*
	Find related action to the event and execute it.
	*/
	function handleKeyEvent($event) {
		actionHotkeyMap.exec($event);
	}

	service = {
		addAction: addAction,
		removeAction: removeAction,
		getAction: getAction,
		getActions: getActions,
		exec: exec,
		handleKeyEvent: handleKeyEvent,
		isShortkeysEnabled: function() {
			return setShortkeysEnabled;
		}
	};

	provider = {
		/* @ngInject */
		$get: function(
        /* angularjs */ $window, $injector, $q, $location,
        /* mb        */ $mbDispatcher, $mbComponent, MbAction, MbActionHotkeyMap) {
			dispatcher = $mbDispatcher;
			mbComponent = $mbComponent;
			window = $window;
			q = $q;
			injector = $injector;
			location = $location;
			Action = MbAction;
			actionHotkeyMap = new MbActionHotkeyMap();

			loadActions();
			if (shortkeysEnabled) {
				document.onkeydown = handleKeyEvent;
			}

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
		setShortkeysEnabled: function(flag) {
			shortkeysEnabled = flag;
			return provider;
		},
		addAction: function(actionId, actionConfig) {
			configs.items[actionId] = actionConfig;
			return provider;
		}
	};
	return provider;

});
