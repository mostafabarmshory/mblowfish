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



angular.module('mblowfish-core')

	/**
	 * @ngdoc Directives
	 * @name mb-navigation-path
	 * @description Display current navigation path of system
	 * 
	 * Navigation path is a menu which is updated by the $navigation service. This menu
	 * show a chain of menu items to show the current path of the system. It is very
	 * usefull to show current path to the users.
	 * 
	 * 
	 */
	.directive('mbNavigationBar', function($mbActions, $mbNavigator) {


		/**
		 * Init the bar
		 */
		function postLink(scope) {
			scope.isVisible = function(menu) {
				// default value for visible is true
				if (angular.isUndefined(menu.visible)) {
					return true;
				}
				if (angular.isFunction(menu.visible)) {
					return menu.visible();
				}
				return menu.visible;
			};

			scope.goToHome = function() {
				$mbNavigator.openPage('');
			};

			/*
			 * maso, 2017: Get navigation path menu. See $mbNavigator.scpoePath for more info
			 */
			scope.pathMenu = $mbActions.getGroup('navigationPathMenu');
		}

		return {
			restrict: 'E',
			replace: false,
			templateUrl: 'views/directives/mb-navigation-bar.html',
			link: postLink
		};
	});
