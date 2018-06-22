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
'use strict';


angular.module('mblowfish-core')

/**
 * @ngdoc directive
 * @name mb-tree
 * @description Tree
 * 
 * Display tree menu
 * 
 */
.directive('mbTree', function($animate, $rootScope) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			mbSection: '='
		},
		templateUrl: 'views/directives/mb-tree.html',
		link: function($scope, $element, $attr) {
			// TODO: maso, 2017:
			/**
			 * Checks if the section is visible
			 */
			function isVisible(section){
				if(!$element.has('li').length){
					return false;
				}
				if(section.hidden){
					return !$rootScope.$eval(section.hidden);
				}
				return true;
			}
			$scope.isVisible = isVisible;
		},
		controller : function($scope) {
			// Current section
			var openedSection = null;


			/**
			 * Check if the opened section is the section.
			 */
			function isOpen(section) {
				return openedSection === section;
			}

			/**
			 * Toggle opened section
			 * 
			 * We just put the section in the tree openedSection and update all
			 * UI.
			 */
			function toggle(section) {
				openedSection = (openedSection === section) ? null : section;
			}

			$scope.isOpen = isOpen;
			$scope.toggle = toggle;
		}
	};
});
