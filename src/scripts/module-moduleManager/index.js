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
mblowfish.config(function($mbPreferencesProvider) {
	
	//-------------------------------------------------------------
	// Preferences:
	// Pages: modules, application,
	//-------------------------------------------------------------
	$mbPreferencesProvider
		.addPage('modules', {
			title: 'Modules',
			icon: 'language',
			description: 'Manage global modules to enable for all users.',
			templateUrl: 'views/modules/mb-preference.html',
		});
		//	$preferences.newPage({
//		id: 'update',
//		templateUrl: 'views/preferences/mb-update.html',
//		title: 'Update application',
//		description: 'Settings of updating process and how to update the application.',
//		icon: 'autorenew'
//	});
//	$options.newPage({
//		title: 'modules',
//		description: 'Manage user modules to enable for all current device.',
//		templateUrl: 'views/modules/mb-option.html',
//		tags: ['modules']
//	});




	//-------------------------------------------------------------
	// Actions:
	//-------------------------------------------------------------

//	$mbActionsProvider.addAction({
//		id: 'mb.app.local.modules.create',
//		type: 'action',
//		priority: 1,
//		icon: 'view_module',
//		title: 'Add local module',
//		description: 'Adds new module into the application.',
//		/*
//		 * @ngInject
//		 */
//		action: function() {
//			return $resource.get('/app/modules', {
//				style: {},
//			}).then(function(modules) {
//				$modules.addLocalModule(modules[0]);
//			});
//		},
//		groups: []
//	})
//	.addAction({
//		id: 'mb.app.local.modules.delete',
//		type: 'action',
//		priority: 1,
//		icon: 'view_module',
//		title: 'Delete local module',
//		description: 'Delete a module from the application.',
//		/*
//		 * @ngInject
//		 */
//		action: function($event) {
//			return $window.confirm('Delete modules?')
//				.then(function() {
//					_.forEach($event.modules, function(module1) {
//						$modules.removeLocalModule(module1);
//					});
//				});
//		},
//		groups: []
//	});

//
//
//	$mbActions.addAction({
//		id: 'mb.app.global.modules.create',
//		type: 'action',
//		priority: 1,
//		icon: 'view_module',
//		title: 'Add global module',
//		description: 'Adds new module into the application.',
//		/*
//		 * @ngInject
//		 */
//		action: function() {
//			return $resource.get('/app/modules', {
//				style: {},
//			}).then(function(modules) {
//				$modules.addGlobalModule(modules[0]);
//				return $mbApplication.storeApplicationConfig();
//			});
//		},
//		groups: []
//	});
//	$mbActions.addAction({
//		id: 'mb.app.global.modules.delete',
//		type: 'action',
//		priority: 1,
//		icon: 'view_module',
//		title: 'Delete global module',
//		description: 'Delete a module from the application.',
//		/*
//		 * @ngInject
//		 */
//		action: function($event) {
//			return $window.confirm('Delete modules?')
//				.then(function() {
//					_.forEach($event.modules, function(module1) {
//						$modules.removeGlobalModule(module1);
//					});
//					return $mbApplication.storeApplicationConfig();
//				});
//		},
//		groups: []
//	});




	//-------------------------------------------------------------
	// Resources:
	//-------------------------------------------------------------
//	$mbResourcePreferences
//		.addPage('mb-module-manual', {
//		label: 'Manual',
//		templateUrl: 'views/modules/mb-resources-manual.html',
//		/*@ngInject*/
//		controller: function($scope) {
//			$scope.$watch('module', function(value) {
//				$scope.$parent.setValue([value]);
//			}, true);
//			$scope.module = _.isArray($scope.value) ? $scope.value[0] : $scope.value;
//		},
//		controllerAs: 'resourceCtrl',
//		tags: ['/app/modules']
//	});
});
