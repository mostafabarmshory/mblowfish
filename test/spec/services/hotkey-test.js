
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

describe('The hotkey service ', function() {

	var $mbHotkey;

	beforeEach(function() {
		// load the service's module
		module('mblowfish-core');
		// instantiate service
		inject(function(_$mbHotkey_) {
			$mbHotkey = _$mbHotkey_;
		});
	});

	describe('byCode', function() {
		it('matches one modifier', function() {
			var event = e(83, 'meta');
			var value = $mbHotkey.isHotkey('Meta+S', event);
			expect(value).toBe(true);
		})

		it('matches two modifiers', function() {
			var event = e(83, 'alt', 'meta');
			var value = $mbHotkey.isHotkey('Meta+Alt+s', event);
			expect(value).toBe(true);
		})

		it('matches lowercase', function() {
			var event = e(83, 'meta');
			var value = $mbHotkey.isHotkey('meta+s', event);
			expect(value).toBe(true);
		})

		it('matches modifier convenience aliases', function() {
			var event = e(83, 'meta');
			var value = $mbHotkey.isHotkey('cmd+s', event);

			expect(value).toBe(true);
		});

		it('matches key convenience aliases', function() {
			var event = e(32, 'meta')
			var value = $mbHotkey.isHotkey('cmd+space', event)

			expect(value).toBe(true);
		})

		it('matches "add" key', function() {
			var event = e(187, 'meta')
			var value = $mbHotkey.isHotkey('cmd+=', event)

			expect(value).toBe(true);
		})

		it('matches "mod" key', function() {
			var event = e(83, 'ctrl')
			var value = $mbHotkey.isHotkey('mod+s', event)

			expect(value).toBe(true);
		})

		it('matches individual modifiers', function() {
			var event = e(16, 'shift')
			var value = $mbHotkey.isHotkey('shift', event)

			expect(value).toBe(true);
		})

		it('matches right meta key', function() {
			var event = e(93, 'meta')
			var value = $mbHotkey.isHotkey('meta', event)

			expect(value).toBe(true);
		})

		it('matches individual keys', function() {
			var event = e(65)
			var value = $mbHotkey.isHotkey('a', event)

			expect(value).toBe(true);
		})

		it('does not match extra modifiers', function() {
			var event = e(83, 'alt', 'meta')
			var value = $mbHotkey.isHotkey('cmd+s', event)
			expect(value).toBe(false);
		})

		it('does not match extra modifiers with individual keys', function() {
			var event = e('a', 'ctrl')
			var value = $mbHotkey.isHotkey('a', event)
			expect(value).toBe(false);
		})

		it('matches optional modifiers', function() {
			var event = e(83, 'alt', 'meta')
			var value = $mbHotkey.isHotkey('cmd+alt?+s', event)

			expect(value).toBe(true);
		})

		it('matches missing optional modifiers', function() {
			var event = e(83, 'meta')
			var value = $mbHotkey.isHotkey('cmd+alt?+s', event)

			expect(value).toBe(true);
		})

		it("matches question mark key", function() {
			var event = e("?");
			var value = $mbHotkey.isHotkey("?", { byKey: true }, event);

			expect(value).toBe(true);;
		});

		it('can be curried', function() {
			var event = e(83, 'meta')
			var curried = $mbHotkey.isHotkey('cmd+s')
			var value = curried(event)

			expect(value).toBe(true);
		})

		it('matches mocked event', function() {
			var event = { which: 13 }
			var value = $mbHotkey.isHotkey('enter', event)

			expect(value).toBe(true);
		})

		it('matches multiple hotkeys', function() {
			var check = $mbHotkey.isHotkey(['meta+a', 'meta+s'])
			var a = check(e(65, 'meta'))
			var s = check(e(83, 'meta'))
			expect(a).toBe(true);
			expect(s).toBe(true);
		})

		it('fails on non-modifier keys', function() {
			expect(function() {
				$mbHotkey.isHotkey('ctrlalt+k');
			}).toThrow(new TypeError('Unknown modifier: "ctrlalt"'));
		})
	});

	describe('byKey', function() {
		it('matches one modifier', function() {
			var event = e('s', 'meta')
			var value = $mbHotkey.isHotkey('Meta+S', { byKey: true }, event)

			expect(value).toBe(true);
		})

		it('matches two modifiers', function() {
			var event = e('ß', 'alt', 'meta')
			var value = $mbHotkey.isHotkey('Meta+Alt+ß', { byKey: true }, event)

			expect(value).toBe(true);
		})

		it('matches lowercase', function() {
			var event = e('s', 'meta')
			var value = $mbHotkey.isHotkey('meta+s', { byKey: true }, event)

			expect(value).toBe(true);
		})

		it('matches modifier convenience aliases', function() {
			var event = e('s', 'meta')
			var value = $mbHotkey.isHotkey('cmd+s', { byKey: true }, event)

			expect(value).toBe(true);
		})

		it('matches key convenience aliases', function() {
			var event = e(' ', 'meta')
			var value = $mbHotkey.isHotkey('cmd+space', { byKey: true }, event)

			expect(value).toBe(true);
		})

		it('matches "add" key', function() {
			var event = e('+', 'meta')
			var value = $mbHotkey.isHotkey('cmd++', { byKey: true }, event)

			expect(value).toBe(true);
		})

		it('matches "mod" key', function() {
			var event = e('s', 'ctrl')
			var value = $mbHotkey.isHotkey('mod+s', { byKey: true }, event)

			expect(value).toBe(true);
		})

		it('matches individual modifiers', function() {
			var event = e('Shift', 'shift')
			var value = $mbHotkey.isHotkey('shift', { byKey: true }, event)

			expect(value).toBe(true);
		})

		it('matches individual keys', function() {
			var event = e('a')
			var value = $mbHotkey.isHotkey('a', { byKey: true }, event)

			expect(value).toBe(true);
		})

		it('does not match extra modifiers', function() {
			var event = e('s', 'alt', 'meta')
			var value = $mbHotkey.isHotkey('cmd+s', { byKey: true }, event)
			expect(value).toBe(false);
		})

		it('does not match extra modifiers with individual keys', function() {
			var event = e('a', 'ctrl')
			var value = $mbHotkey.isHotkey('a', { byKey: true }, event)
			expect(value).toBe(false);
		})

		it('matches optional modifiers', function() {
			var event = e('s', 'alt', 'meta')
			var value = $mbHotkey.isHotkey('cmd+alt?+s', { byKey: true }, event)

			expect(value).toBe(true);
		})

		it('matches missing optional modifiers', function() {
			var event = e('s', 'meta')
			var value = $mbHotkey.isHotkey('cmd+alt?+s', { byKey: true }, event)

			expect(value).toBe(true);
		})

		it('can be curried', function() {
			var event = e('s', 'meta')
			var curried = $mbHotkey.isHotkey('cmd+s', { byKey: true })
			var value = curried(event)

			expect(value).toBe(true);
		})

		it('matches mocked event', function() {
			var event = { key: 'Enter' }
			var value = $mbHotkey.isHotkey('enter', { byKey: true }, event)

			expect(value).toBe(true);
		})

		it('matches multiple hotkeys', function() {
			var check = $mbHotkey.isHotkey(['meta+a', 'meta+s'], { byKey: true })
			var a = check(e('a', 'meta'))
			var s = check(e('s', 'meta'))
			expect(a).toBe(true);
			expect(s).toBe(true);
		})

		it('fails on non-modifier keys', function() {
			var event = e('k', 'ctrl', 'alt');
			expect(function() {
				$mbHotkey.isHotkey('ctrlalt+k', { byKey: true }, event)
			}).toThrow(new TypeError('Unknown modifier: "ctrlalt"'));
		})
	})

})