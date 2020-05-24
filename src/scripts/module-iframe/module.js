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
angular.module('mblowfish-core').run(function(
	/* AngularJs */ $window,
	/* Mblowfish */ $mbEditor, $mbActions, $mbToolbar) {

	$mbEditor.add('/mb/ui/iframe/:url', {
		title: 'IFrame',
		description: 'Open external page',
		controller: 'MbIFrameContainerCtrl',
		controllerAs: 'ctrl',
		template: '<iframe src="https://7tooti.com/wb/blog"></iframe>',
		groups: ['Utilities']
	});//


	$mbActions.addAction('mb.iframe.open', {
		title: 'Open URL',
		description: 'Open a url',
		icon: 'open_in_browser',
		action: function() {
			$window.prompt('Enter the URL.', 'https://viraweb123.ir/wb/')
				.then(function(input) {
					return $mbEditor.open('/mb/ui/editor/iframe/' + input);
				});
		}
	});

	$mbToolbar.addToolbar('/mb/ui/iframe', {
		items: ['mb.iframe.open']
	});

	$mbToolbar.getToolbarGroup()
		.addToolbar('/mb/ui/iframe');
});
