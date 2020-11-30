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
@name MbEditor
@description An editor

An editor is used to edit an item in the framework.

The editor is called derty if there is an unstored change in the item.

 */
mblowfish.factory('MbEditor', function(MbFrame) {

	function MbEditor(configs) {
		MbFrame.call(this, configs);
		this.derty = false;
		return this;
	};
	// Circle derives from Shape
	MbEditor.prototype = Object.create(MbFrame.prototype);

	MbEditor.prototype.render = function(locals) {
		locals.$editor = this;
		locals.$mbRouteParams = this.$route;
		locals.$routeParams = this.$route;
		// add othere services to push
		return MbFrame.prototype.render.call(this, locals);
	};


	MbEditor.prototype.updateTitle = function() {
		return MbFrame.prototype.setTitle.call(this, (this.isDerty() ? '*' : '') + this.title);
	}

	MbEditor.prototype.setTitle = function(title) {
		if (this.title === title) {
			return this;
		}
		this.title = title;
		return this.updateTitle();
	};

	MbEditor.prototype.setDerty = function(derty) {
		if (this.derty === derty) {
			return;
		};
		this.derty = derty;
		return this.updateTitle();
	};

	MbEditor.prototype.isDerty = function() {
		return this.derty;
	};

	return MbEditor;
});
