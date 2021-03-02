/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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

import storageSupported from '../functionStorageSupported';

/**
 * @ngdoc Services
 * @name $mbStorage
 * @description A service to work with storage of browser
 * 
 */
function mbStorage() {



	var storageKeyPrefix = 'ngStorage-';
	var serializer = angular.toJson;
	var deserializer = angular.fromJson;
	var storageType = 'localStorage';

	var providerWebStorage = storageSupported(window, storageType);


	return {

		setKeyPrefix: function(prefix) {
			if (typeof prefix !== 'string') {
				throw new TypeError('[mblowfish] - $mbStorage Provider.setKeyPrefix() expects a String.');
			}
			storageKeyPrefix = prefix;
		},


		setSerializer: function(s) {
			if (typeof s !== 'function') {
				throw new TypeError('[mblowfish] -  $mbStorage Provider.setSerializer expects a function.');
			}
			serializer = s;
		},

		setDeserializer: function(d) {
			if (typeof d !== 'function') {
				throw new TypeError('[ngStorage] -  $mbStorage Provider.setDeserializer expects a function.');
			}
			deserializer = d;
		},

		supported: function(type) {
			type = type || 'localStorage';
			return !!storageSupported(window, storageType);
		},

		// Note: This is not very elegant at all.
		get: function(key) {
			return providerWebStorage && deserializer(providerWebStorage.getItem(storageKeyPrefix + key));
		},

		// Note: This is not very elegant at all.
		set: function(key, value) {
			return providerWebStorage && providerWebStorage.setItem(storageKeyPrefix + key, serializer(value));
		},

		remove: function(key) {
			providerWebStorage && providerWebStorage.removeItem(storageKeyPrefix + key);
		},

		/* @ngInject */
		$get: function(
			$rootScope, $window, $mbLog, $timeout, $document
		) {

			// The magic number 10 is used which only works for some keyPrefixes...
			// See https://github.com/gsklee/ngStorage/issues/137
			var prefixLength = storageKeyPrefix.length;
			var isSupported = storageSupported($window, storageType);

			// #9: Assign a placeholder object if Web Storage is unavailable to prevent breaking the entire AngularJS app
			// Note: recheck mainly for testing (so we can use $window[storageType] rather than window[storageType])
			var webStorage = isSupported || ($mbLog.warn('This browser does not support Web Storage!'), { setItem: angular.noop, getItem: angular.noop, removeItem: angular.noop });
			var $storage = {
				$default: function(items) {
					for (var k in items) {
						angular.isDefined($storage[k]) || ($storage[k] = angular.copy(items[k]));
					}
					$storage.$sync();
					return $storage;
				},
				$reset: function(items) {
					for (var k in $storage) {
						'$' === k[0] || (delete $storage[k] && webStorage.removeItem(storageKeyPrefix + k));
					}
					return $storage.$default(items);
				},
				$sync: function() {
					for (var i = 0, l = webStorage.length, k; i < l; i++) {
						// #8, #10: `webStorage.key(i)` may be an empty string (or throw an exception in IE9 if `webStorage` is empty)
						(k = webStorage.key(i)) && storageKeyPrefix === k.slice(0, prefixLength) && ($storage[k.slice(prefixLength)] = deserializer(webStorage.getItem(k)));
					}
				},
				$apply: function() {
					var temp$storage;
					_debounce = null;
					if (!_.isEqual($storage, _last$storage)) {
						temp$storage = angular.copy(_last$storage);
						angular.forEach($storage, function(v, k) {
							if (angular.isDefined(v) && '$' !== k[0]) {
								webStorage.setItem(storageKeyPrefix + k, serializer(v));
								delete temp$storage[k];
							}
						});
						for (var k in temp$storage) {
							webStorage.removeItem(storageKeyPrefix + k);
						}
						_last$storage = angular.copy($storage);
					}
				},
				$supported: function() {
					return !!isSupported;
				}
			};
			var _last$storage;
			var _debounce;

			$storage.$sync();

			_last$storage = angular.copy($storage);

			$rootScope.$watch(function() {
				_debounce || (_debounce = $timeout($storage.$apply, 100, false));
			});

			// #6: Use `$window.addEventListener` instead of `angular.element` to avoid the jQuery-specific `event.originalEvent`
			$window.addEventListener && $window.addEventListener('storage', function(event) {
				if (!event.key) {
					return;
				}
				// Reference doc.
				var doc = $document[0];
				if ((!doc.hasFocus || !doc.hasFocus()) && storageKeyPrefix === event.key.slice(0, prefixLength)) {
					event.newValue ? $storage[event.key.slice(prefixLength)] = deserializer(event.newValue) : delete $storage[event.key.slice(prefixLength)];
					_last$storage = angular.copy($storage);
					$rootScope.$apply();
				}
			});

			$window.addEventListener && $window.addEventListener('beforeunload', function() {
				$storage.$apply();
			});

			return $storage;
		}
	};
}

export default mbStorage;

