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


angular.module('mblowfish-core').run(function($resource, $location, $controller) {
	//-------------------------------------------------------------//
	// Modules:
	//
	// - CMS module
	// - Manual module
	//-------------------------------------------------------------//
	$resource.newPage({
		label: 'Manual',
		type: 'mb-module-manual',
		templateUrl: 'views/modules/mb-resources-manual.html',
		/*
		 * @ngInject
		 */
		controller: function($scope) {
			$scope.$watch('module', function(value) {
				$scope.$parent.setValue([value]);
			}, true);
			$scope.module = _.isArray($scope.value) ? $scope.value[0] : $scope.value;
		},
		controllerAs: 'resourceCtrl',
		priority: 8,
		tags: ['/app/modules']
	});
});
