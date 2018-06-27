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
 * @name MbPasswordCtrl
 * @memberof ngMaterialHomeUser
 * @description
 * 
 * این کنترلر داده‌های یوزرنیم پسورد و ایمیل را از
 * کاربر دریافت و در سیستم ذخیره می‌نماید
 * همچنین در صورت برخورد با مشکل پیام‌های مناسب نمایش می‌دهد
 * 
 * 
 */
.controller('MbPasswordCtrl', function($scope, $usr, $location, $navigator, $routeParams, $window, $errorHandler) {

	var ctrl = {
			sendingToken: false,
			sendTokenState: null,
			changingPass: false,
			changingPassState: null
	};

	$scope.data = {};
	$scope.data.token = $routeParams.token;

	function sendToken(data, form) {
		if(ctrl.sendingToken){
			return false;
		}
		ctrl.sendingToken = true;
		data.callback = $location.absUrl() + '/token/{{token}}';
		return $usr.resetPassword(data)//
		.then(function() {
			ctrl.sendTokenState = 'success';
			$scope.sendingTokenMessage = null;
		}, function(error){
			ctrl.sendTokenState = 'fail';
			$scope.sendingTokenMessage = $errorHandler.handleError(error, form);
		})//
		.finally(function(){
			ctrl.sendingToken = false;
		});
	};

	function changePassword(param, form) {
		if(ctrl.changingPass){
			return false;
		}
		ctrl.changingPass = true;
		var data = {
				'token' : param.token,
				'new' : param.password
		};
		return $usr.resetPassword(data)//
		.then(function() {
			ctrl.changePassState = 'success';
			$scope.changePassMessage = null;
			$navigator.openView('users/login');
		}, function(error){
			ctrl.changePassState = 'fail';
        	$scope.changePassMessage = $errorHandler.handleError(error, form);
		})//
		.finally(function(){
			ctrl.changingPass = false;
		});
	};

	function back() {
		$window.history.back();
	}

	$scope.ctrl = ctrl;

	$scope.sendToken = sendToken;
	$scope.changePassword = changePassword;

	$scope.cancel = back;

});

