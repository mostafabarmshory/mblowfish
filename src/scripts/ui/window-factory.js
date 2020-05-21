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
@name MbWindow
@description A container which is managed with layout manager to display

 */
angular.module('mblowfish-core').factory('MbWindow', function(MbContainer) {

	function MbWindow(configs) {
		MbContainer.call(this, configs);
		this.toolbar = undefined;
		this.menu = undefined;
		return this;
	};

	// Circle derives from Shape
	MbWindow.prototype = Object.create(MbContainer.prototype);

	MbWindow.prototype.getToolbar = function() { };
	MbWindow.prototype.getMenu = function() { };
	MbWindow.prototype.setTitle = function() { };
	MbWindow.prototype.close = function() { };

	return MbWindow;
});
