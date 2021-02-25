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
 * @ngdoc Services
 * @name $mbUtil
 * @description utility in Mblowfish
 * 
 */
export default function() {

	/**
	 * Creates a shallow copy of an object, an array or a primitive.
	 *
	 * Assumes that there are no proto properties for objects.
	 */
	function shallowCopy(src, dst) {
		if (this.isArray(src)) {
			dst = dst || [];
			for (var i = 0, ii = src.length; i < ii; i++) {
				dst[i] = src[i];
			}
		} else if (this.isObject(src)) {
			dst = dst || {};
			for (var key in src) {
				if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
					dst[key] = src[key];
				}
			}
		}
		return dst || src;
	};



	function parseBooleanValue(value) {
		value = value.toLowerCase();
		switch (value) {
			case true:
			case 'true':
			case '1':
			case 'on':
			case 'yes':
				return true;
			default:
				return false;
		}
	}

	/*
	 * Bind list of roles to app data
	 */
	function rolesToPermissions(roles) {
		var permissions = [];
		for (var i = 0; i < roles.length; i++) {
			var role = roles[i];
			permissions[role.application + '_' + role.code_name] = true;
			permissions[role.application + '.' + role.code_name] = true;
		}
		return permissions;
	}

	function keyValueToMap(keyvals) {
		var map = [];
		for (var i = 0; i < keyvals.length; i++) {
			var keyval = keyvals[i];
			map[keyval.key] = keyval.value;
		}
		return map;
	}



	function isEqualId(a, b) {
		if (_.isUndefined(a) || _.isUndefined(b)) {
			return false;
		}
		return _.isEqual(a + '', b + '');
	}


	_.assign(this, {
		isEqualId: isEqualId,
		rolesToPermissions: rolesToPermissions,
		keyValueToMap: keyValueToMap,
		shallowCopy: shallowCopy,
		parseBooleanValue: parseBooleanValue,
		noop: angular.noop,
		isArray: angular.isArray,
		isObject: angular.isObject,
		isDefined:  angular.isDefined,
		isFunction: angular.isFunction,
	});
};
