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
 * @ngdoc controller
 * @name AmdHelpCtrl
 * @description Help page controller
 * 
 */
.controller('AmdHelpCtrl', function($scope, $rootScope, $route, $http, $translate) {
	$rootScope.showHelp = false;



	function _loadHelpContent() {
		if (!$rootScope.showHelp) {
			return;
		}
		// TODO: maso, 2018: check if route is changed.
		var currentState = $route.current;
		var lang = $translate.use() === 'fa' ? 'fa' : 'en';
		if (currentState && currentState.config) {
			var myId = currentState.config.helpId;
			if (angular.isFunction(myId)) {
				myId = myId(currentState);
			}
			if (!angular.isDefined(myId)) {
				myId = 'not-found';
			}
			// load content
			$http.get('resources/helps/' + myId + '-' + lang + '.json') //
			.then(function(res) {
				$scope.helpContent = res.data;
			});
		} else {
			$http.get('resources/helps/not-found-' + lang + '.json') //
			.then(function(res) {
				$scope.helpContent = res.val;
			});
		}
	}
	
	$scope.closeHelp = function(){
		$rootScope.showHelp = false;
	}
	
	$scope.$watch('showHelp', _loadHelpContent);

	$scope.$watch(function(){
		return $route.current;
	}, _loadHelpContent);
});