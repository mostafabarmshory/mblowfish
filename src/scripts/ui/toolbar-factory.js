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
@name MbToolbar
@description A toolbar model

Toolbar display list of ui component on top of a view, editor or the main application.

A unique address is used for each toolbar for example

	/demo/view/test

Default toolbar is '/app/toolbar'.

Toolbar is a UI component.

You can add a toolbar into a toolbar, however, do not add them more than two lever.

 */
angular.module('mblowfish-core').factory('MbToolbar', function(MbContainer) {

	function MbToolbar(configs) {
		MbContainer.call(this, configs);
		return this;
	};
	
	// Circle derives from Shape
	MbToolbar.prototype = Object.create(MbContainer.prototype);

	MbToolbar.prototype.addAction = function(action) {
	};

	MbToolbar.prototype.addComponent = function(component) {
	};

	return MbToolbar;
});
