
function mbMimetype() {

	/**
	 * RegExp to match type in RFC 6838
	 *
	 * type-name = restricted-name
	 * subtype-name = restricted-name
	 * restricted-name = restricted-name-first *126restricted-name-chars
	 * restricted-name-first  = ALPHA / DIGIT
	 * restricted-name-chars  = ALPHA / DIGIT / "!" / "#" /
	 *                          "$" / "&" / "-" / "^" / "_"
	 * restricted-name-chars =/ "." ; Characters before first dot always
	 *                              ; specify a facet name
	 * restricted-name-chars =/ "+" ; Characters after last plus always
	 *                              ; specify a structured syntax suffix
	 * ALPHA =  %x41-5A / %x61-7A   ; A-Z / a-z
	 * DIGIT =  %x30-39             ; 0-9
	 */
	var
		SUBTYPE_NAME_REGEXP = /^[A-Za-z0-9\*][A-Za-z0-9!#$&^_.-]{0,126}$/,
		TYPE_NAME_REGEXP = /^[A-Za-z0-9\*][A-Za-z0-9!#$&^_-]{0,126}$/,
		TYPE_REGEXP = /^ *([A-Za-z0-9\*][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9\*][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;

	var
		provider,
		service,
		Mimetype;



	/**
	 * Format object to media type.
	 *
	 * @param {object} obj
	 * @return {string}
	 * @public
	 */
	function format(obj) {
		if (!_.isObject(obj)) {
			throw new TypeError('argument obj is required');
		}

		var subtype = obj.subtype;
		var suffix = obj.suffix;
		var type = obj.type;

		if (!type || !TYPE_NAME_REGEXP.test(type)) {
			throw new TypeError('invalid type');
		}

		if (!subtype || !SUBTYPE_NAME_REGEXP.test(subtype)) {
			throw new TypeError('invalid subtype');
		}

		// format as type/subtype
		var string = type + '/' + subtype;

		// append +suffix
		if (suffix) {
			if (!TYPE_NAME_REGEXP.test(suffix)) {
				throw new TypeError('invalid suffix');
			}

			string += '+' + suffix;
		}

		return string;
	}

	/**
	 * Test media type.
	 *
	 * @param {string} string
	 * @return {object}
	 * @public
	 */

	function test(string) {
		if (!string) {
			throw new TypeError('argument string is required');
		}

		if (typeof string !== 'string') {
			throw new TypeError('argument string is required to be a string');
		}

		return TYPE_REGEXP.test(string.toLowerCase());
	}

	/**
	 * Parse media type to object.
	 *
	 * @param {string} string
	 * @return {object}
	 * @public
	 */

	function parse(string) {
		if (string instanceof Mimetype) {
			return string;
		}

		if (!string) {
			throw new TypeError('argument string is required');
		}

		if (typeof string !== 'string') {
			throw new TypeError('argument string is required to be a string');
		}

		var match = TYPE_REGEXP.exec(string.toLowerCase());

		if (!match) {
			throw new TypeError('invalid media type');
		}

		var type = match[1];
		var subtype = match[2];
		var suffix;

		// suffix after last +
		var index = subtype.lastIndexOf('+');
		if (index !== -1) {
			suffix = subtype.substr(index + 1);
			subtype = subtype.substr(0, index);
		}

		return new Mimetype(type, subtype, suffix);
	}

	function isEqual(a, b) {
		a = parse(a);
		b = parse(b);

		return (a.type === '*' || b.type === '*' || a.type === b.type) &&
			(a.subtype === '*' || b.subtype === '*' || a.subtype === b.subtype);
	}


	//---------------------------------------------------------------------
	// init
	//---------------------------------------------------------------------
	service = {
		parse: parse,
		test: test,
		format: format,
		isEqual: isEqual
	};
	provider = {
		$get: function(MbMimetype) {
			'ngInject';
			Mimetype = MbMimetype;
			return service;
		}
	};
	return provider;
}

export default mbMimetype;
