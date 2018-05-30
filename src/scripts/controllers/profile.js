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
 * @memberof mblowfish-core
 * @name ContentCtrl
 * @description # ContentCtrl
 * 
 */
.controller('MbProfileCtrl', function($scope, $app, $translate, $window) {

	var ctrl = {
		user: null,
		profile: null
	};
	
	/**
	 * Loads user data
	 * @returns
	 */
	function loadUser(){
		if(ctrl.loadingUser){
			return;
		}
		ctrl.loadingUser = true;
		return $app.currentUser()//
		.then(function(user){
			ctrl.user = user;
			return user;
		}, function(){
			alert($translate.instant('Fail to load user.'));
		})//
		.finally(function(){
			ctrl.loadingUser = false;
		});
	}

	function loadProfile(usr){
		if(ctrl.loadinProfile){
			return;
		}
		ctrl.loadingProfile = true;
		return usr.profile()//
		.then(function(profile){
			ctrl.profile = profile;
			return profile;
		}, function(){
			alert($translate.instant('Fial to load profile.'));
		})//
		.finally(function(){
			ctrl.loadingProfile = false;
		});
	}
	
	/**
	 * Save current user
	 * 
	 * @returns
	 */
	function save(){
		if(ctrl.savingProfile){
			return;
		}
		ctrl.savingProfile = true;
		return ctrl.profile.update()//
		.then(function(){
			toast($translate.instant('Save is successfull.'));
		}, function(){
			alert($translate.instant('Fail to save item.'));
		})//
		.finally(function(){
			ctrl.savingProfile = false;
		});
	}

	function back() {
		 $window.history.back();
	}

	function load(){
		return loadUser()//
		.then(loadProfile);
	}
	
	$scope.ctrl = ctrl;	
	$scope.load = load;
	$scope.reload = load;
	$scope.save = save;
	$scope.back = back;
	$scope.cancel = back;

	load();
	
});
