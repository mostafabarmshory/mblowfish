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
 * @name MbAccountCtrl
 * @description Manages account of users.
 * 
 * Manages current user action
 */
.controller('MbAccountCtrl', function($scope, $rootScope, $app, $translate, $window, $usr, $errorHandler) {

	var ctrl = {
			loginProcess: false,
			loginState: null,
			logoutProcess: false,
			logoutState: null,
			changingPassword: false,
			changePassState: null,
			updatingAvatar: false,
			loadingUser: false,
			savingUser: false
	};

	/**
	 * Call login process for current user
	 * 
	 * @memberof AmhUserAccountCtrl
	 * @name login
	 * @param {object}
	 *            cridet username and password
	 * @param {string}
	 *            cridet.login username
	 * @param {stirng}
	 *            cridig.password Password
	 * @returns {promiss} to do the login
	 */
	function login(cridet, form) {
		if(ctrl.loginProcess){
			return false;
		}
		ctrl.loginProcess= true;
		return $app.login(cridet)//
		.then(function(){
			ctrl.loginState = 'success';
			$scope.loginMessage = null;
		}, function(error){
			ctrl.loginState = 'fail';
			$scope.loginMessage = $errorHandler.handleError(error, form);
		})
		.finally(function(){
			ctrl.loginProcess = false;
		});
	}

	function logout() {
		if(ctrl.logoutProcess){
			return false;
		}
		ctrl.logoutProcess= true;
		return $app.logout()//
		.then(function(){
			ctrl.logoutState = 'success';
		}, function(){
			ctrl.logoutState = 'fail';
		})
		.finally(function(){
			ctrl.logoutProcess = false;
		});
	}

	/**
	 * Change password of the current user
	 * 
	 * @name load
	 * @memberof MbAccountCtrl
	 * @returns {promiss} to change password
	 */
	function changePassword(data, form) {
		if(ctrl.changingPassword){
			return;
		}
		ctrl.changingPassword = true;
		var param = {
				'old' : data.oldPass,
				'new' : data.newPass,
				'password': data.newPass,
		};
//		return $usr.resetPassword(param)//
		$scope.app.user.current.newPassword(param)
		.then(function(){
			$app.logout();
			ctrl.changePassState = 'success';
			$scope.changePassMessage = null;
			toast($translate.instant('Password is changed successfully. Login with new password.'));
		}, function(error){
			ctrl.changePassState = 'fail';
			$scope.changePassMessage = $errorHandler.handleError(error, form);
                        alert($translate.instant('Failed to change new password.'));
		})//
		.finally(function(){
			ctrl.changingPassword = false;
		});
	}


	/**
	 * Update avatar of the current user
	 * 
	 * @name load
	 * @memberof MbAccountCtrl
	 * @returns {promiss} to update avatar
	 */
	function updateAvatar(avatarFiles){
		// XXX: maso, 1395: reset avatar
		if(ctrl.updatingAvatar){
			return;
		}
		ctrl.updatingAvatar = true;
		return ctrl.user.newAvatar(avatarFiles[0].lfFile)//
		.then(function(){
			// TODO: hadi 1397-03-02: only reload avatar image by clear and set (again) avatar address in view
			// clear address before upload and set it again after upload.
			$window.location.reload();
                        toast($translate.instant('Your avatar updated successfully.'));
		}, function(){
			alert($translate.instant('Failed to update avatar'));
		})//
		.finally(function(){
			ctrl.updatingAvatar = false;
		});
	}

	function back() {
		$window.history.back();
	}


	/**
	 * Loads user data
	 * 
	 * @name load
	 * @memberof MbAccountCtrl
	 * @returns {promiss} to load user data
	 */
	function loadUser(){
		if(ctrl.loadingUser){
			return;
		}
		ctrl.loadingUser = true;
		return $usr.session()//
		.then(function(user){
			ctrl.user = user;
		}, function(error){
			ctrl.error = error;
		})//
		.finally(function(){
			ctrl .loadingUser = false;
		});
	}


	/**
	 * Save current user
	 * 
	 * @name load
	 * @memberof MbAccountCtrl
	 * @returns {promiss} to save
	 */
	function saveUser(form){
		if(ctrl.savingUser){
			return;
		}
		ctrl.savingUser = true;
		return ctrl.user.update()//
		.then(function(user){
			ctrl.user = user;
			$scope.saveUserMessage = null; 
                        toast($translate.instant('Your information updated successfully.'));
		}, function(error){
			$scope.saveUserMessage = $errorHandler.handleError(error, form);
                        alert($translate.instant('Failed to update.'));
		})//
		.finally(function(){
			ctrl.savingUser = false;
		});
	}

	// TODO: maso, 2017: getting from server
	// Account property descriptor
	$scope.apds = [ {
		key : 'first_name',
		title : 'First name',
		type : 'string'
	}, {
		key : 'last_name',
		title : 'Last name',
		type : 'string'
	}, {
		key : 'language',
		title : 'language',
		type : 'string'
	}, {
		key : 'timezone',
		title : 'timezone',
		type : 'string'
	} ];

	$scope.$watch(function(){
		return $rootScope.app.user;
	}, function(usrStruct){
		$scope.appUser = usrStruct;
	}, true);

	// Bind to scope
	$scope.ctrl = ctrl;
	$scope.login = login;
	$scope.logout = logout;
	$scope.changePassword = changePassword;
	$scope.updateAvatar = updateAvatar;
	$scope.load = loadUser;
	$scope.reload = loadUser;
	$scope.saveUser = saveUser;

	$scope.back = back;
	$scope.cancel = back;

	loadUser();
});


