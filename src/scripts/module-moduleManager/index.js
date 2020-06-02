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
mblowfish.config(function($mbPreferencesProvider, $mbActionsProvider, $mbResourceProvider) {

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
			controller: 'MbModulesCtrl',
			controllerAs: 'ctrl',
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
	$mbActionsProvider
		.addAction('mb.modules.create', {
			title: 'Add local module',
			/* @ngInject*/
			action: function($mbResource, $mbModules) {
				return $mbResource
					.get('/app/modules', {
						style: {},
					})
					.then(function(modules) {
						_.forEach(modules, function(m) {
							$mbModules.addModule(m);
						});
					});
			}
		})
		.addAction('mb.modules.delete', {
			title: 'Delete local module',
			icon: 'view_module',
			/* @ngInject */
			action: function($window, $mbModules, $event) {
				return $window
					.confirm('Delete modules?')
					.then(function() {
						_.forEach($event.modules, function(m) {
							$mbModules.removeModule(m);
						});
					});
			}
		});



	//-------------------------------------------------------------
	// Resources:
	//-------------------------------------------------------------
	$mbResourceProvider
		.addPage('mb-module-manual', {
			label: 'Manual',
			templateUrl: 'views/modules/mb-resources-manual.html',
			/*@ngInject*/
			controller: function($scope) {
				$scope.$watch('module', function(value) {
					$scope.$parent.setValue([value]);
				}, true);
				$scope.module = _.isArray($scope.value) ? $scope.value[0] : $scope.value;
			},
			controllerAs: 'resourceCtrl',
			tags: ['/app/modules']
		});
});
