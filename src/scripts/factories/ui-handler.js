/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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
@ngdoc Factories
@name MbUiHandler
@description An handler to a ui component or container

It handles visible part of components or containers.

 */
angular.module('mblowfish-core').factory('MbUiHandler', function() {

	function MbUiHandler(configs) {
		_.assign(this, configs);
	};

	// Circle derives from Shape
	MbUiHandler.prototype = Object.create(Object.prototype);

	MbUiHandler.prototype.destroy = function() {
		if (this.$isDestoried) {
			// TODO: maso, 2020: add a log
			return;
		}
		this.$isDestoried = true;
		try {
			this.$scope.$destroy();
			delete this.$scope;
		} catch (err) {
			// TODO: log
		}

		try {
			if (this.$keepRootElement) {
				this.$element.empty();
			} else {
				this.$element.remove();
			}
			delete this.$element;
		} catch (err) {
			// TODO: log
		}

		delete this.$controller;
	};


	MbUiHandler.prototype.isDestroied = function() {
		return this.$isDestoried;
	};

	MbUiHandler.prototype.setVisible = function(visible) {
		// XXX: maso, 2020: set display none
	};

	MbUiHandler.prototype.isVisible = function() {
		// XXX: maso, 2020: check if the display of the element is not none
		return false;
	};

	return MbUiHandler;
});
