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

angular.module('app')
	.controller('DemoExplorerViewCtrl', function(
		MbAction,
		/* Service injected into a view controller */
		$toolbar, // The main toolbar of the view
		$menu,    // The main menu of the view
		$frame    // The frame (visible element in layout manager) of the view
	) {

		this.refreshList = function() {
			alert('Not implemented');
		};

		var ctrl = this;

		/*
		Here is an example to create and add action into the view toolbar
		*/
		var refreshAction = new MbAction({
			title: 'Refresh',
			description: 'Refresh list of demo items',
			icon: 'save',
			action: function() {
				ctrl.refreshList();
			}
		});
		$toolbar.addAction(refreshAction);
	})
	.run(function($mbView) {
		$mbView.add('/demo/explorer', {
			title: 'Demo Explorer',
			description: 'List of all demo and tutorials.',
			controller: 'DemoExplorerViewCtrl',
			controllerAs: 'ctrl',
			templateUrl: 'views/demo-explorer.html',
		})
	})