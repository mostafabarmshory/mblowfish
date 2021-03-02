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

mblowfish.controller('MbLocalResourceLanguageUploadCtrl', function($scope, $http) {
	$http.get('resources/common-languages.json')
		.then(function(res) {
			$scope.languages = res.data;
		});

	this.setLanguage = function(lang) {
		$scope.$parent.setValue(lang);
	};

	var ctrl = this;
	$scope.$watch('files.length', function(files) {
		if (!$scope.files || $scope.files.length <= 0) {
			return;
		}
		var reader = new FileReader();
		reader.onload = function(event) {
			var lang = JSON.parse(event.target.result);
			ctrl.setLanguage(lang);
		};
		reader.readAsText($scope.files[0].lfFile);
	});

});