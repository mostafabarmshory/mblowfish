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

Manages clipboard
 */
angular.module('mblowfish-core').service('$clipboard', function() {

	this.copyTo = function(model) {
        /*
         * TODO: Masood, 2019: There is also another solution but now it doesn't
         * work because of browsers problem A detailed solution is presented in:
         * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
         */
		var js = JSON.stringify(model);
		var fakeElement = document.createElement('textarea');
		fakeElement.value = js;
		document.body.appendChild(fakeElement);
		fakeElement.select();
		document.execCommand('copy');
		document.body.removeChild(fakeElement);
		return;
	};
});