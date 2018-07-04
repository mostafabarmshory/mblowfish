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
 * @name MbThemesCtrl
 * @description Dashboard
 * 
 */
.controller('MbLanguageCtrl', function($scope, $app, $rootScope, $http, $translate) {

	function init(){		
		$app.config('languages')//
		.then(function(langs){
			$scope.languages = langs;
			return langs;
		})//
		.then(function(){
			if(!$scope.languages){
				$http.get('resources/languages.json')//
				.then(function(res){
					var data = res ? res.data : {};
					$scope.languages = data.languages;
//				$rootScope.app.config.languages = $scope.languages;
				});
			}
		})//
		.finally(function(){			
			$scope.myLanguage = $translate.use();
		});
	}
	

	function setLanguage(lang){
		$scope.myLanguage = lang;
		// XXX: hadi 1397-03-13: Following two commands should be replaced with a command from $language
		$translate.refresh($scope.myLanguage.key);
		$translate.use($scope.myLanguage.key);
		if(!$rootScope.app.config.local){
			$rootScope.app.config.local = {};
		}
		$rootScope.app.config.local.language = $scope.myLanguage.key;
		if($scope.myLanguage.dir){
			$rootScope.app.config.local.dir = $scope.myLanguage.dir;
			$rootScope.app.dir = $scope.myLanguage.dir;
		}
	}
	
	$scope.setLanguage = setLanguage;
	
	init();
});
