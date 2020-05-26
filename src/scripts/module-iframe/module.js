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

	//
	//  $mbEditor: manages all editor of an application. An editor has a dynamic
	// address and there may be multiple instance of it at the same time but with
	// different parameter.
	//
	// There are serveral editor registered here to cover some of our system 
	// functionalities such as:
	//
	// - Open a new URL
	//
	$mbEditor.registerEditor('/mb/iframe/:url*', {
		title: 'IFrame',
		description: 'Open external page',
		controller: 'MbIFrameContainerCtrl',
		controllerAs: 'ctrl',
		template: '<iframe class="mb-module-iframe" ng-src="{{ctrl.currentContenttUrl}}"></iframe>',
		groups: ['Utilities']
	});

	$mbActions.addAction('mb.iframe.open', {
		title: 'Open URL',
		description: 'Open a url',
		icon: 'open_in_browser',
		/* @ngInject */
		action: function($location) {
			$window.prompt('Enter the URL.', 'https://viraweb123.ir/wb/')
				.then(function(input) {
					$location.url('/mb/iframe/' + input);
					// $mbEditor.open('/mb/iframe/' + input, {param1: 'value1'});
				});
		}
	});

	$mbToolbar.addToolbar('/mb/iframe', {
		items: ['mb.iframe.open']
	});

	//-----------------------------------------------------------------------
	//  Adds iframe toolbar into the main toolbar group. Note that, this 
	// must handle in the final application.
	//-----------------------------------------------------------------------
	$mbToolbar.getToolbarGroup()
		.addToolbar('/mb/iframe');
});
