
/**
@ngdoc Factories
@name MbActionHotkeyMap
@description Maps hotkey to actions




 */
mblowfish.factory('MbActionHotkeyMap', function($mbHotkey, $injector) {

	//---------------------------------------
	// Utility
	//---------------------------------------
	function findActions(map, event) {
		var result = false;
		_.forEach(map, function(actions) {
			if (actions.isHotkey(event)) {
				result = actions;
				return false;
			}
		});
		return result;
	}


	//---------------------------------------
	// Factory
	//---------------------------------------
	function ActionHotkeyMap() {
		this.map = {};
	};

	/**
	Executes the action
	 */
	ActionHotkeyMap.prototype.add = function(action) {
		var hotkey = action.hotkey;
		if (_.isUndefined(hotkey)) {
			return this;
		}

		var actions = this.map[hotkey];
		if (_.isUndefined(actions)) {
			this.map[hotkey] = actions = [];
			actions.isHotkey = $mbHotkey.isHotkey(hotkey);
		}

		var index = actions.indexOf(action);
		if (index < 0) {
			actions.push(action);
		}
		// TODO: log the action is added before
		return this;
	};

	ActionHotkeyMap.prototype.remove = function(action) {
		var hotkey = action.hotkey;
		if (_.isUndefined(hotkey)) {
			return this;
		}
		var actions = this.map[hotkey];
		if (_.isUndefined(actions)) {
			return this;
		}

		var index = actions.indexOf(action);
		if (index > -1) {
			actions.splice(index, 1);
		}
		return this;
	};

	/**
	Checks if there is an action related to the event or not
	
	@memberof MbActionHotkeyMap
	@param Event $evetn a key event 
	@returns true if there is an action
	 */
	ActionHotkeyMap.prototype.has = function($event) {
		var actions = findActions(this.map, $event);
		return !_.isUndefined(actions) && actions.length > 0;
	};


	/**
	Finds list of related actions to the $event
	
	@memberof MbActionHotkeyMap
	@param Event $evetn a key event 
	@returns list of actions or undefiend
	 */
	ActionHotkeyMap.prototype.get = function($event) {
		var actions = findActions(this.map, $event);
		if (actions !== false && actions.length > 0) {
			return actions;
		}
		return false;
	};


	/**
	Finds related action and execute it.
	
	If there is no related action, then false returned.
	
	@memberof MbActionHotkeyMap
	@params $event a key event to handle
	@returns false|promise to execute the actions
	 */
	ActionHotkeyMap.prototype.exec = function($event) {
		var actions = findActions(this.map, $event);
		if (!actions || actions.length <= 0) {
			return false;
		}

		var $mbActions = $injector.get('$mbActions');
		return $mbActions.exec(actions, $event);
	};

	return ActionHotkeyMap;
});
