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
 * @name amd-style-color
 * @descritpion Manages color of an element 
 * 
 * 
 */
.directive('amdStyleColor', function ($mdTheming, $rootScope) {
	/*
	 * Apply colors
	 */
	function _apply_color($element, styleColor) {
		angular.forEach(styleColor, function(value, key){
//			var themeColors = ssSideNavSections.theme.colors;
			
			var split = (value || '').split('.')
			if (split.length < 2) {
				split.unshift('primary');
			}
			
			var hueR = split[1] || 'hue-1'; // 'hue-1'
			var colorR = split[0] || 'primary'; // 'warn'
			
			// Absolute color: 'orange'
			var theme = $mdTheming.THEMES[$rootScope.app.setting.theme];
			if(typeof theme === 'undefined'){
				// if theme is not valid we choose default theme
				theme = $mdTheming.THEMES['default'];
			}
			var colorA = theme.colors[colorR] ?  theme.colors[colorR].name : colorR;
			
			// Absolute Hue: '500'
			var hueA =  theme.colors[colorR] ? (theme.colors[colorR].hues[hueR] || hueR) : hueR;
			
			var colorValue = $mdTheming.PALETTES[colorA][hueA] ? $mdTheming.PALETTES[colorA][hueA].value : $mdTheming.PALETTES[colorA]['500'].value;
			
			$element.css(key, 'rgb(' + colorValue.join(',') + ')');
			
			// Add color to md-sidenav
			if($element.parent().attr('md-component-id')){
				$element.parent().css(key, 'rgb(' + colorValue.join(',') + ')');
			}
		});
	}
	
	/*
	 * Link function
	 */
	function linkFunction($scope, $element, $attrs) {
		// TODO: maso, 2017: check if it is possible to remvoe code in release condetion.
		if (!$mdTheming.THEMES || !$mdTheming.PALETTES) {
			return console.warn('amd-style-color: you probably want to $mdTheming');
		}
		// XXX: maso, 2017: lesson on property changes.
//		$scope.$watch($attrs.amdStyleColor, function (newVal) {
//			if (newVal) {
//				_apply_color($element, newVal);
//			}
//		});
		$rootScope.$watch('app.setting.theme', function(newVal){
			_apply_color($element, $scope.$eval($attrs.amdStyleColor));
		});
		_apply_color($element, $scope.$eval($attrs.amdStyleColor));
	}

	return {
		restrict: 'A',
//		scope: {
//		ssStyleColor: '='
//		},
		link: linkFunction
	};
});