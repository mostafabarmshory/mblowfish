/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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
 * @ngdoc Directives
 * @name mb-error-messages
 * @description An error message display
 */
.directive('mbErrorMessages', function($compile, $interpolate) {

	/*
	 * Link function
	 */
	function postLink(scope, element){
		
		/**
		 * Original element which replaced by this directive.
		 */
		var origin = null;
		
		scope.errorMessages = function(err){
			if(!err) {
				return;
			}
			var message = {};
			message[err.status]= err.statusText;
			message[err.data.code]= err.data.message;
			return message;
		};
		
		scope.$watch(function(){
			return scope.mbErrorMessages;
		}, function(value){	
			if(value){
				var tmplStr = 
					'<div ng-messages="errorMessages(mbErrorMessages)" role="alert" multiple>'+
					'	<div ng-messages-include="views/mb-error-messages.html"></div>' +
					'</div>';
				var el = angular.element(tmplStr);
				var cmplEl = $compile(el);
				var myEl = cmplEl(scope);
				origin = element.replaceWith(myEl);
			} else if(origin){
				element.replaceWith(origin);
				origin = null;
			}
		});
	}

	/*
	 * Directive
	 */
	return {
		restrict: 'A',
		scope:{
			mbErrorMessages : '='
		},
		link: postLink
	};
});