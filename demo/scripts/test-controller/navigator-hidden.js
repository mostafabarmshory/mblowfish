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

angular.module('app')
/**
 * 
 */
.controller('TestNavigatorHiddenPathCtrl', function($scope, $rootScope, $navigator) {
	// Integerate with dashboard
    $navigator.scopePath($scope)//
	.add({
		title: 'Example',
	})//
	.add({
		title: 'Navigator',
	})//
	.add({
		title: 'Hidden navigator',
		active: function(){
			$navigator.openPage('/test/navigator/hidden');
		}
	});
    
	/**
	 * Update the object in scope
	 */
	function toggle() {
		$rootScope.navigatorHiddenTestFlag = !$rootScope.navigatorHiddenTestFlag;
	}

	$scope.toggleNavigation = function(){
		$rootScope.navigatorGroupHiddenTestFlag = !$rootScope.navigatorGroupHiddenTestFlag;
	}
	
	$scope.toggle = toggle;
});