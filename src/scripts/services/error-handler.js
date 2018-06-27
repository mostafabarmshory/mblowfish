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
 * @ngdoc service
 * @name $$errorHandler
 * @description A service to handle errors in forms.
 * 
 * 
 * 
 */
.service('$errorHandler', function($navigator, $mdToast) {

	/**
	 * Checks status, message and data of the error. If given form is not null, it set related values in $error of 
	 * fields in the form.
	 * It also returns a general message to show to the user.
	 */
	function handleError(error, form){
		var message = null;
		if(error.status === 400 && form){ // Bad request
			message = 'Form is not valid. Fix errors and retry again.';
//			form.$invalid = true;
			error.data.data.forEach(function(item){
				var constraints = item.constraints.map(function(cons){
					if(form[item.name]){						
						form[item.name].$error[cons.toLowerCase()] = true;
					}
				});
			});
		}else{				
			message = error.data.message;
		}

//		if(error.status === 401){
//		message = 'Username or password is incorrect';
//		}else if(error.status === 402){
//		message = 'Access is forbiden';
//		}else if(error.status === 408){
//		message = 'Request Timeout';
//		}else if(error.status >= 500 && error.status <600){
//		message = 'Server could not response to your request'
//		}

		return message;
	}


	return {
		handleError: handleError
	};
});
