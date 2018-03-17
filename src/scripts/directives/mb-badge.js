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
'use strict';

angular.module('mblowfish-core')
/**
 * 
 */
.directive('mbBadge', function($mdTheming) {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		link: function(scope, element, attributes) {
			$mdTheming(element);
		},
		template: function(element, attributes) {
			return '<div class="mb-badge" ng-transclude></div>';
		}
	};
});

angular.module('mblowfish-core')
.directive('mbBadge', function($mdTheming, $mdColors, $timeout, $window, $compile, $rootScope) {

	function postLink(scope, element, attributes) {
		$mdTheming(element);
		//
		var parent = element.parent();
//		var badge = document.createElement('div');
		var bg = angular.element('<div></div>');
		var link = $compile(bg);
		var badge = link(scope);

		var offset = parseInt(attributes.mdBadgeOffset);
		if (isNaN(offset)) {
			offset = 10;
		}
		function toRGB(color){
			var split = (color || '').split('-')
			if (split.length < 2) {
				split.push('500');
			}
			
			var hueA = split[1] || '800'; // '800'
			var colorR = split[0] || 'primary'; // 'warn'
			
			var theme = $mdTheming.THEMES[$rootScope.app.setting.theme || $rootScope.app.config.theme || 'default'];
			if(typeof theme === 'undefined'){
				theme = $mdTheming.THEMES['default'];
			}
			var colorA = theme.colors[colorR] ?  theme.colors[colorR].name : colorR;
			var colorValue = $mdTheming.PALETTES[colorA][hueA] ? $mdTheming.PALETTES[colorA][hueA].value : $mdTheming.PALETTES[colorA]['500'].value;
			return 'rgb(' + colorValue.join(',') + ')';
		}
		function style(where, color) {
			if (color) {
				badge.css(where, toRGB(color));
			}
		}
		badge.addClass('mb-badge');
		badge.css('position', 'absolute');
		parent.append(badge);
		scope.$watch(function() {
			return attributes.mbBadgeColor;
		}, function(value){
			style('color', value);
		});
		scope.$watch(function() {
			return attributes.mbBadgeFill;
		}, function(value){
			style('background-color', value);
		});
		scope.$watch(function() {
			return attributes.mbBadge;
		}, function(value){
			badge.text(value);
			badge.css({
				'display' : value ? 'initial' : 'none',
			});
		});
		var position = function(value) {
			var top = element.prop('offsetTop');
			badge.css({
				'display' : attributes.mbBadge && top ? 'initial' : 'none',
				'left' : value.left + value.width - 20 + offset + 'px',
				'top' : value.top + value.height - 20 + offset + 'px'
			});
//			badge.style.left = value.left + value.width - 20 + offset + 'px';
//			badge.style.top = value.top + value.height - 20 + offset + 'px';
		};
		scope.$watch(function() {
			return {
				top: element.prop('offsetTop'),
				left: element.prop('offsetLeft'),
				width: element.prop('offsetWidth'),
				height: element.prop('offsetHeight')
			};
		}, function(value) {
			position(value);
		}, true);
		$timeout(function() {
			scope.$digest();
		});
		var update = function() {
			position({
				top: element.prop('offsetTop'),
				left: element.prop('offsetLeft'),
				width: element.prop('offsetWidth'),
				height: element.prop('offsetHeight')
			});
		};
		angular.element($window)
		.bind('resize', function(){
			update();
		});
	}
	return {
		restrict: 'A',
		link: postLink,
	};
});
