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
mblowfish.factory('MbObservableObject', function($log) {

	function ObservableObject() {
		this.silent = false;
		this.callbacks = {};
	}

	/**
	 * Set widget silent
	 * 
	 * @memberof AmhObservableObject
	 */
	ObservableObject.prototype.setSilent = function(silent) {
		this.silent = silent;
	};

	/**
	 * Checks if the element is silent
	 * 
	 * @memberof AmhObservableObject
	 */
	ObservableObject.prototype.isSilent = function() {
		return this.silent;
	};

	/**
	 * Adds new callback of type
	 * 
	 * @param typeof
	 *            the event
	 * @param callback
	 *            to call on the event
	 * @memberof AmhObservableObject
	 */
	ObservableObject.prototype.on = function(type, callback) {
		if (!angular.isFunction(callback)) {
			throw {
				message: 'Callback must be a function'
			};
		}
		var callbacks = this.callbacks;
		if (!angular.isArray(callbacks[type])) {
			callbacks[type] = [];
		}
		if (callbacks[type].includes(callback)) {
			return;
		}
		callbacks[type].push(callback);
	};

	/**
	 * Remove the callback
	 * 
	 * @param type
	 *            of the event
	 * @param callback
	 *            to remove
	 * @memberof AmhObservableObject
	 */
	ObservableObject.prototype.off = function(type, callback) {
		var callbacks = this.callbacks;
		if (!angular.isArray(callbacks[type])) {
			return;
		}
		var index = callbacks[type].indexOf(callback);
		if (index > -1) {
			callbacks[type].splice(index, 1);
		}
	};

	/**
	 * Call all callbacks on the given event type.
	 * 
	 * Before callbacks, widget processors will process the widget and event.
	 * 
	 * @param type
	 *            of the event
	 * @param params
	 *            to add to the event
	 * @memberof AmhObservableObject
	 */
	ObservableObject.prototype.fire = function(type, params) {
		// 1- Call processors
		var event = _.merge({
			source: this,
			type: type
		}, params || {});
		var callbacks = this.callbacks;

		// 2- call listeners
		if (this.isSilent() || !angular.isDefined(callbacks[type])) {
			return;
		}
		var cl = callbacks[type];
		for (var i = 0; i < cl.length; i++) {
			// TODO: maso, 2018: check if the event is stopped to propagate
			try {
				cl[i].apply(cl[i], [event]);
			} catch (error) {
				$log.error({
					source: 'ObservableObject',
					message: 'The listener throw an unexpected exception.',
					exception: error
				});
			}
		}
	};

	return ObservableObject;
});