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
.controller('InlineEditCtrl', function($scope, editableOptions) {

	/**
	 * Update the object in scope
	 */
	function onSave() {
		return alert("It call the on save method to do some BIZ in your application and wait for. New value"
				+ $scope.object.attr);
	}

	$scope.onSave = onSave;
	$scope.updateObject = onSave;
	$scope.object = {
			attr : 'Inline Edit',
			doc : 'The title value id editable. Click on to edit. You can place any data into the inline directive to supporte inline edit.',
			html : '<a href=\"http://gitlab.com\">Edit</a> You can edit html but there is sompe problem in click.'
	};
	$scope.user = {
			email: 'email@example.com',
			tel: '123-45-67',
			number: 29,
			range: 10,
			url: 'http://example.com',
			search: 'blabla',
			color: '#6a4415',
			date: null,
			time: new Date(1970, 0, 1, 12, 30),
			month: null,
			week: null,
			password: 'password',
			datetimeLocal: null,
			file: null
	}; 
	
	$scope.toggleXEdit = function(){
		editableOptions.isDisabled = !editableOptions.isDisabled;
		$scope.editable = !editableOptions.isDisabled; 
	};
	
	$scope.editable = !editableOptions.isDisabled;
	
});