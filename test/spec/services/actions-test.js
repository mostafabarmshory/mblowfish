

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

describe('The mbActions service should', function() {

	var
		$mbActions,
		MbAction,
		$timeout;

	beforeEach(function() {
		// load the service's module
		module('mblowfish-core');
		// instantiate service
		inject(function(_$mbActions_, _MbAction_, _$timeout_) {
			$mbActions = _$mbActions_;
			MbAction = _MbAction_;
			$timeout = _$timeout_;
		});
	});

	it('implement the service api', function() {
		expect(_.isFunction($mbActions.exec)).toBe(true);
		expect(_.isFunction($mbActions.addAction)).toBe(true);
		expect(_.isFunction($mbActions.removeAction)).toBe(true);
		expect(_.isFunction($mbActions.getAction)).toBe(true);
		expect(_.isFunction($mbActions.getActions)).toBe(true);
	});

	it('executes an action', function(done) {
		var key = 'test.action.' + Math.random();
		$mbActions.addAction(key, {
			title: 'test action',
			description: 'Runs a random action',
			action: function() {
				done();
			}
		});

		var result = $mbActions.exec(key);
		expect(result).not.toBe(undefined);
		$timeout.flush();
	});

	it('executes an action directly', function(done) {
		var key = 'test.action.' + Math.random();
		var action = new MbAction({
			title: 'test action',
			description: 'Runs a random action',
			action: function() {
				done();
			}
		});
		$mbActions.addAction(key, action);
		var result = action.exec();
		expect(result).not.toBe(undefined);
		$timeout.flush();
	});

	it('handle key event', function(done) {
		var key = 'test.service.actions.' + Math.random();
		var action = new MbAction({
			title: 'test action',
			description: 'Runs a random action',
			hotkey: 'alt+s',
			action: function() {
				done();
			}
		});
		$mbActions.addAction(key, action);

		var event = e(83, 'alt');
		$mbActions.handleKeyEvent(event);
		$timeout.flush();
	});
});