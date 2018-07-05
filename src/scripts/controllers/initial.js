// TODO: should be moved to mblowfish-core

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
 * @name MbInitialCtrl
 * @description Show initialization page
 * 
 * Display initialization page to set initial configuration of SPA.
 * 
 */
.controller('MbInitialCtrl', function($scope, $rootScope, $preferences, $mdStepper, $navigator, $window) {

	function goToStep(index){
		var stepper = $mdStepper('setting-stepper');
		if(!$rootScope.app.user.owner){
			stepper.error('You are not allowed');
			return;
		}
		stepper.goto(index);
	}

	function nextStep(){
		var stepper = $mdStepper('setting-stepper');
		if(!$rootScope.app.user.owner){
			stepper.error('You are not allowed');
			return;
		}
		stepper.next();
	}

	function prevStep(){			
		var stepper = $mdStepper('setting-stepper');
		stepper.back();
	}

	function initialization(){
		// Configure language page. It will be added as first page of setting stepper
		var langPage = {
			id: 'initial-language',
			title: 'Language',
			templateUrl : 'views/preferences/mb-language.html',
			controller : 'MbLanguageCtrl',
			description: 'Select default language of web application.',
			icon: 'language',
			priority: 'first',
			required: true
		};
		// Configure welcome page. It will be added as one of the first pages of setting stepper
		var welcomePage = {
				id: 'welcome',
				title: 'Welcome',
				templateUrl : 'views/preferences/welcome.html',
				controller : 'MbWelcomeCtrl',
				description: 'Welcome. Please login to continue.',
				icon: 'accessibility',
				priority: 'first',
				required: true
		};
		var congratulatePage = {
			id: 'congratulate',
			templateUrl : 'views/preferences/congratulate.html',
			title: ':)',
			description: 'Congratulation. Your site is ready.',
			icon: 'favorite',
			priority: 'last',
			required: true
		};
		$preferences.newPage(langPage);
		$preferences.newPage(welcomePage);
		$preferences.newPage(congratulatePage);
		// Load settings
		$preferences.pages()//
		.then(function(settingItems) {
//			$scope.settings = settingItems.items;
			$scope.settings = [];
			settingItems.items.forEach(function(sItem){
				if(sItem.required){
					$scope.settings.push(sItem);
				}
			});
			// add watch on setting stepper current step.
			$scope.$watch(function(){
				var stepper = $mdStepper('setting-stepper');
				return stepper.currentStep;
			}, function(val){
				if(!$scope.settings || $scope.settings.length === 0){
					return;
				}
				$scope.pageId = $scope.settings[val].id;
			});
		});
	}

	var callWatch = $scope.$watch(function(){
		return $rootScope.app.initial;
	}, function(val){
		if(val){
			initialization();
		}else if(val === false){
			// TODO: remove initial-language, welcome and congratulate pages if are added already.
			// remove watch
			callWatch();
			// redirect to main page
//			$navigator.openPage($scope.mainPage);
			$window.location = $scope.mainPage;
		}
	});

	$scope.settings = [];
	$scope.nextStep = nextStep;
	$scope.prevStep = prevStep;
	$scope.goToStep = goToStep;

	$scope.mainPage=$window.location.href.replace(/initialization$/mg, '');
});
