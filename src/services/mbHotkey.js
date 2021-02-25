/**

A simple way to check whether a browser event matches a hotkey.

Features

- Uses a simple, natural syntax for expressing hotkeys—mod+s, cmd+alt+space, etc.
- Accepts mod for the classic "cmd on Mac, ctrl on Windows" use case.
- Can use either event.which (default) or event.key to work regardless of keyboard layout.
- Can be curried to reduce parsing and increase performance when needed.
- Is very lightweight, weighing in at < 1kb minified and gzipped.


## Example

The most basic usage...

	function onKeyDown(e) {
	  if ($mbHotkey.isHotkey('mod+s', e)) {
	    ...
	  }
	}

Or, you can curry the hotkey string for better performance, since it is only parsed once...


	var isSaveHotkey = $mbHotkey.isHotkey('mod+s')
	function onKeyDown(e) {
	  if (isSaveHotkey(e)) {
	    ...
	  }
	}

## Why?

There are tons of hotkey libraries, but they're often coupled to the view layer, or they bind events 
globally, or all kinds of weird things. You don't really want them to bind the events for you, you 
can do that yourself.

Instead, you want to just check whether a single event matches a hotkey. And you want to define your 
hotkeys in the standard-but-non-trivial-to-parse syntax that everyone knows.

But most libraries don't expose their parsing logic. And even for the ones that do expose their hotkey 
parsing logic, pulling in an entire library just to check a hotkey string is overkill.

So this is a simple and lightweight hotkey checker!


## API

	isHotkey('mod+s')(event)
	isHotkey('mod+s', { byKey: true })(event)
	
	isHotkey('mod+s', event)
	isHotkey('mod+s', { byKey: true }, event)

You can either pass hotkey, [options], event in which case the hotkey will be parsed and compared 
immediately. Or you can passed just hotkey, [options] to receive a curried checking function that 
you can re-use for multiple events.

	isHotkey('mod+a')
	isHotkey('Control+S')
	isHotkey('cmd+opt+d')
	itHotkey('Meta+DownArrow')
	itHotkey('cmd+down')

The API is case-insentive, and has all of the conveniences you'd expect—cmd vs. Meta, opt vs. Alt, 
down vs. DownArrow, etc.

It also accepts mod for the classic "cmd on Mac, ctrl on Windows" use case.

	isHotkey('mod+s')(event)
	isHotkey('mod+s', { byKey: true })(event)
	
	isCodeHotkey('mod+s', event)
	isKeyHotkey('mod+s', event)

By default the hotkey string is checked using event.which. But you can also pass in byKey: true to 
compare using the KeyboardEvent.key API, which stays the same regardless of keyboard layout.

Or to reduce the noise if you are defining lots of hotkeys, you can use the isCodeHotkey and 
isKeyHotkey helpers that are exported.

	toKeyName('cmd') // "meta"
	toKeyName('a') // "a"
	
	toKeyCode('shift') // 16
	toKeyCode('a') // 65

You can also use the exposed toKeyName and toKeyCode helpers, in case you want to add the same level 
of convenience to your own APIs.

	const hotkey = parseHotkey('mod+s', { byKey: true })
	const passes = compareHotkey(hotkey, event)

You can also go even more low-level with the exposed parseHotkey and compareHotkey functions, which are 
what the default isHotkey export uses under the covers, in case you have more advanced needs.


 */
function mbHotkey() {

	//---------------------------------------
	// Services
	//---------------------------------------
	var
		service,
		provider;


	//---------------------------------------
	// variables
	//---------------------------------------
	var IS_MAC = (
		typeof window != 'undefined' &&
		/Mac|iPod|iPhone|iPad/.test(window.navigator.platform)
	)

	var MODIFIERS = {
		alt: 'altKey',
		control: 'ctrlKey',
		meta: 'metaKey',
		shift: 'shiftKey',
	}

	var ALIASES = {
		add: '+',
		break: 'pause',
		cmd: 'meta',
		command: 'meta',
		ctl: 'control',
		ctrl: 'control',
		del: 'delete',
		down: 'arrowdown',
		esc: 'escape',
		ins: 'insert',
		left: 'arrowleft',
		mod: IS_MAC ? 'meta' : 'control',
		opt: 'alt',
		option: 'alt',
		return: 'enter',
		right: 'arrowright',
		space: ' ',
		spacebar: ' ',
		up: 'arrowup',
		win: 'meta',
		windows: 'meta',
	}

	var CODES = {
		backspace: 8,
		tab: 9,
		enter: 13,
		shift: 16,
		control: 17,
		alt: 18,
		pause: 19,
		capslock: 20,
		escape: 27,
		' ': 32,
		pageup: 33,
		pagedown: 34,
		end: 35,
		home: 36,
		arrowleft: 37,
		arrowup: 38,
		arrowright: 39,
		arrowdown: 40,
		insert: 45,
		delete: 46,
		meta: 91,
		numlock: 144,
		scrolllock: 145,
		';': 186,
		'=': 187,
		',': 188,
		'-': 189,
		'.': 190,
		'/': 191,
		'`': 192,
		'[': 219,
		'\\': 220,
		']': 221,
		'\'': 222,
	}

	for (var f = 1; f < 20; f++) {
		CODES['f' + f] = 111 + f
	}



	//---------------------------------------
	// functions
	//---------------------------------------
	function isHotkey(hotkey, options, event) {
		if (options && !('byKey' in options)) {
			event = options
			options = null
		}
		if (!Array.isArray(hotkey)) {
			hotkey = [hotkey]
		}
		var array = hotkey.map(function(string) {
			return parseHotkey(string, options);
		});
		var check = function(e) {
			return array.some(function(object) {
				return compareHotkey(object, e);
			});
		};
		var ret = event == null ? check : check(event)
		return ret
	}

	function isCodeHotkey(hotkey, event) {
		return isHotkey(hotkey, event)
	}

	function isKeyHotkey(hotkey, event) {
		return isHotkey(hotkey, { byKey: true }, event)
	}


	function parseHotkey(hotkey, options) {
		var byKey = options && options.byKey
		var ret = {}

		// Special case to handle the `+` key since we use it as a separator.
		hotkey = hotkey.replace('++', '+add')
		var values = hotkey.split('+')
		var length = values.length;

		// Ensure that all the modifiers are set to false unless the hotkey has them.
		for (var k in MODIFIERS) {
			ret[MODIFIERS[k]] = false
		}

		for (var value of values) {
			var optional = value.endsWith('?') && value.length > 1;

			if (optional) {
				value = value.slice(0, -1)
			}

			var name = toKeyName(value)
			var modifier = MODIFIERS[name]

			if (value.length > 1 && !modifier && !ALIASES[value] && !CODES[name]) {
				throw new TypeError(`Unknown modifier: "${value}"`)
			}

			if (length === 1 || !modifier) {
				if (byKey) {
					ret.key = name
				} else {
					ret.which = toKeyCode(value)
				}
			}

			if (modifier) {
				ret[modifier] = optional ? null : true
			}
		}

		return ret
	}

	/**
	 * Compare.
	 */

	function compareHotkey(object, event) {
		for (var key in object) {
			var expected = object[key];
			var actual;

			if (expected == null) {
				continue;
			}

			if (key === 'key' && event.key != null) {
				actual = event.key.toLowerCase();
			} else if (key === 'which') {
				actual = expected === 91 && event.which === 93 ? 91 : event.which;
			} else {
				actual = event[key];
			}

			if (actual == null && expected === false) {
				continue;
			}

			if (actual !== expected) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Utils.
	 */

	function toKeyCode(name) {
		name = toKeyName(name);
		const code = CODES[name] || name.toUpperCase().charCodeAt(0);
		return code;
	}

	function toKeyName(name) {
		name = name.toLowerCase();
		name = ALIASES[name] || name;
		return name;
	}

	//---------------------------------------
	// End
	//---------------------------------------
	service = {
		isHotkey: isHotkey,
		isCodeHotkey: isCodeHotkey,
		isKeyHotkey: isKeyHotkey,
		parseHotkey: parseHotkey,
		compareHotkey: compareHotkey,
		toKeyCode: toKeyCode,
		toKeyName: toKeyName
	};
	provider = {
		$get: function() {
			'ngInject';
			return service;
		}
	};
	return provider;
}

export default mbHotkey;

