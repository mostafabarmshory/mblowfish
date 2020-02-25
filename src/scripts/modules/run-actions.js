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
 * Manages system moduels
 */
angular.module('mblowfish-core').run(function($actions, $modules, $resource, $window, $app) {
	$actions.newAction({
		id: 'mb.app.local.modules.create',
		type: 'action',
		priority: 1,
		icon: 'view_module',
		title: 'Add local module',
		description: 'Adds new module into the application.',
		/*
		 * @ngInject
		 */
		action: function() {
			return $resource.get('/app/modules', {
				style: {},
			}).then(function(modules) {
				$modules.addLocalModule(modules[0]);
			});
		},
		groups: []
	});
	$actions.newAction({
		id: 'mb.app.local.modules.delete',
		type: 'action',
		priority: 1,
		icon: 'view_module',
		title: 'Delete local module',
		description: 'Delete a module from the application.',
		/*
		 * @ngInject
		 */
		action: function($event) {
			return $window.confirm('Delete modules?')
				.then(function() {
					_.forEach($event.modules, function(module1) {
						$modules.removeLocalModule(module1);
					});
				});
		},
		groups: []
	});



	//--------------------------------------------------------------------------------
	// Global
	//--------------------------------------------------------------------------------
	$actions.newAction({
		id: 'mb.app.global.modules.create',
		type: 'action',
		priority: 1,
		icon: 'view_module',
		title: 'Add global module',
		description: 'Adds new module into the application.',
		/*
		 * @ngInject
		 */
		action: function() {
			return $resource.get('/app/modules', {
				style: {},
			}).then(function(modules) {
				$modules.addGlobalModule(modules[0]);
				return $app.storeApplicationConfig();
			});
		},
		groups: []
	});
	$actions.newAction({
		id: 'mb.app.global.modules.delete',
		type: 'action',
		priority: 1,
		icon: 'view_module',
		title: 'Delete global module',
		description: 'Delete a module from the application.',
		/*
		 * @ngInject
		 */
		action: function($event) {
			return $window.confirm('Delete modules?')
				.then(function() {
					_.forEach($event.modules, function(module1) {
						$modules.removeGlobalModule(module1);
					});
					return $app.storeApplicationConfig();
				});
		},
		groups: []
	});
});

