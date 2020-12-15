
/**
 * Utils
 */

function e(value, ...modifiers) {
	return {
		which: typeof value == 'number' ? value : null,
		key: typeof value == 'string' ? value : null,
		altKey: modifiers.includes('alt'),
		ctrlKey: modifiers.includes('ctrl'),
		metaKey: modifiers.includes('meta'),
		shiftKey: modifiers.includes('shift'),
	};
}

/**
 * Tests.
 */

describe('The MbActionHotkeyMap factory ', function() {

	var
		MbActionHotkeyMap,
		MbAction;

	beforeEach(function() {
		// load the service's module
		module('mblowfish-core');
		// instantiate service
		inject(function(_MbActionHotkeyMap_, _MbAction_) {
			MbActionHotkeyMap = _MbActionHotkeyMap_;
			MbAction = _MbAction_;
		});
	});

	it('should be possible to create a new instance', function() {
		var test = new MbActionHotkeyMap();
		expect(test).not.toBe(undefined);
	});

	it('should find an action with hotkey', function() {
		var map = new MbActionHotkeyMap();
		var action = new MbAction({
			hotkey: 'alt+s'
		});
		map.add(action);

		var event = e(83, 'alt');
		expect(map.has(event)).toBe(true);

		var actions = map.get(event);
		expect(_.isArray(actions)).toBe(true);
		expect(actions.length).toBe(1);
		expect(map.exec(event)).not.toBe(false);

		var eventAlt = e(83, 'alt', 'meta');
		expect(map.has(eventAlt)).toBe(false);

		var actionsAlt = map.get(eventAlt);
		expect(_.isArray(actionsAlt)).toBe(false);
		expect(actionsAlt).toBe(false);
		expect(map.exec(eventAlt)).toBe(false);
	});

	it('should add and remove actions', function() {
		var map = new MbActionHotkeyMap();
		var action = new MbAction({
			hotkey: 'alt+s'
		});
		map.add(action);

		var event = e(83, 'alt');
		expect(map.has(event)).toBe(true);

		var actions = map.get(event);
		expect(_.isArray(actions)).toBe(true);
		expect(actions.length).toBe(1);
		expect(map.exec(event)).not.toBe(false);


		map.remove(action);
		expect(map.has(event)).toBe(false);

		actions = map.get(event);
		expect(_.isArray(actions)).toBe(false);
		expect(actions).toBe(false);
		expect(map.exec(event)).toBe(false);

	});

});