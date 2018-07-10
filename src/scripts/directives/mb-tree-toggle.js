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
 * @ngdoc Directives
 * @name mb-tree-toggle
 * @description Tree toggle
 * 
 * Display tree toggle
 * 
 */
.directive('mbTreeToggle', function($timeout, $animateCss, $mdSidenav, $mdMedia, $rootScope) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			mbSection: '='
		},
		templateUrl: 'views/directives/mb-tree-toggle.html',
		link: function($scope, $element, $attr, $ctrl) {
			var _el_ul = $element.find('ul');

			var getTargetHeight = function() {
				var _targetHeight;

				_el_ul.addClass('no-transition');
				_el_ul.css('height', '');

				_targetHeight = _el_ul.prop('clientHeight');

				_el_ul.css('height', 0);
				_el_ul.removeClass('no-transition');

				return _targetHeight;
			};

			if (!_el_ul) {
				return console.warn('mb-tree: `menuToggle` cannot find ul element');
			}

			
			
			function toggleMenu(open) {
//				if (!$mdMedia('gt-sm') && !$mdSidenav('left').isOpen() && open) {
//				return;
//				}
				$animateCss(_el_ul, {
					from: {
						height: open ? 0 : (getTargetHeight() + 'px')
					},
					to: {
						height: open ? (getTargetHeight() + 'px') : 0
					},
					duration: 0.3
				}).start();
			}

			$scope.$watch(function() {
				return $ctrl.isOpen($scope.mbSection);
			}, function(open) {
				$timeout(function(){
					toggleMenu(open);
				}, 0, false);
			});
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

			/**
			 * Checks if the section is visible
			 */
			function isVisible(section){
				if(!section){
					for(var i = 0; i < $scope.mbSection.sections.length; i++){
						if(!$rootScope.$eval($scope.mbSection.sections[i].hidden)){
							return true;
						}
					}
					return false;
				}
				if(section.hidden){
					return !$rootScope.$eval(section.hidden);
				}
				return true;
			}

			/*
			 * Init scope
			 */
			if(angular.isFunction($scope.$parent.isOpen)){
				$scope.isOpen = $scope.$parent.isOpen;
				$scope.toggle = $scope.$parent.toggle;
			} else {
				$scope.isOpen = isOpen;
				$scope.toggle = toggle;
			}
			
			this.isOpen = $scope.isOpen;
			
			$scope.isVisible = isVisible;

//			$scope.$on('SS_SIDENAV_FORCE_SELECTED_ITEM', function (event, args) {
//			if ($scope.section && $scope.section.pages) {
//			for (var i = $scope.section.pages.length - 1; i >= 0; i--) {
//			var _e = $scope.section.pages[i];
			//
//			if (args === _e.id) {
//			$scope.toggle($scope.section);
//			$state.go(_e.state);
//			}
//			};
//			}
//			});
		}
	};
});
